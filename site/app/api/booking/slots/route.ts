import { NextResponse } from 'next/server';
import { getGraphClient } from '../../../../lib/graphClient';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const dateStr = searchParams.get('date'); // YYYY-MM-DD
    const timeZone = searchParams.get('timezone') || 'UTC';

    if (!dateStr) {
      return NextResponse.json({ success: false, error: 'Date parameter is required' }, { status: 400 });
    }

    // Default business hours slots (9:00 AM to 5:30 PM, 30-min intervals)
    const baseSlots = [
      '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
      '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
      '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
    ];

    const senderEmail = process.env.SENDER_EMAIL || 'mail@vanceitsolutions.com';

    let busyRanges: Array<{ start: Date; end: Date }> = [];

    try {
      const graphClient = getGraphClient();

      // Query Microsoft Graph API getSchedule endpoint for calendar availability
      const scheduleResponse = await graphClient
        .api(`/users/${senderEmail}/calendar/getSchedule`)
        .post({
          schedules: [senderEmail],
          startTime: {
            dateTime: `${dateStr}T00:00:00`,
            timeZone: timeZone
          },
          endTime: {
            dateTime: `${dateStr}T23:59:59`,
            timeZone: timeZone
          },
          availabilityViewInterval: 30
        });

      if (scheduleResponse?.value?.[0]?.scheduleItems) {
        busyRanges = scheduleResponse.value[0].scheduleItems.map((item: any) => ({
          start: new Date(item.start.dateTime + 'Z'),
          end: new Date(item.end.dateTime + 'Z')
        }));
      }
    } catch (graphError: any) {
      console.warn('Microsoft Graph getSchedule warning (using fallback calendar view):', graphError.message);
      try {
        const graphClient = getGraphClient();
        const startDateTime = `${dateStr}T00:00:00Z`;
        const endDateTime = `${dateStr}T23:59:59Z`;
        const calendarView = await graphClient
          .api(`/users/${senderEmail}/calendarView`)
          .query({ startDateTime, endDateTime })
          .select('start,end')
          .get();

        if (calendarView?.value) {
          busyRanges = calendarView.value.map((item: any) => ({
            start: new Date(item.start.dateTime + (item.start.timeZone === 'UTC' ? 'Z' : '')),
            end: new Date(item.end.dateTime + (item.end.timeZone === 'UTC' ? 'Z' : ''))
          }));
        }
      } catch (e: any) {
        console.warn('Calendar view fallback warning:', e.message);
      }
    }

    // Determine availability for each time slot
    const slots = baseSlots.map(timeStr => {
      const [hoursStr, minutesStr] = timeStr.split(':');
      const hours = parseInt(hoursStr, 10);
      const minutes = parseInt(minutesStr, 10);

      const period = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 === 0 ? 12 : hours % 12;
      const displayTime = `${displayHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;

      const slotStart = new Date(`${dateStr}T${timeStr}:00`);
      const slotEnd = new Date(slotStart.getTime() + 30 * 60 * 1000);

      const isBusy = busyRanges.some(busy => {
        return slotStart < busy.end && slotEnd > busy.start;
      });

      const now = new Date();
      const isPast = slotStart.getTime() < now.getTime() + 15 * 60 * 1000;

      return {
        time: timeStr,
        displayTime,
        available: !isBusy && !isPast,
        reason: isBusy ? 'Booked' : isPast ? 'Past' : undefined
      };
    });

    return NextResponse.json({ success: true, date: dateStr, slots });
  } catch (error: any) {
    console.error('Error fetching calendar slots:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
