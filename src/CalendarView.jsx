import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

const CalendarView = (props) => {
  const events = [];
  //currently just views the calendar with the user's events, but cant click on each event to see more details
  if (props.userInviteData) {
    props.userInviteData.forEach(ele => {
      const event = {
        eventId: ele.id,
        title: ele.event_name,
        start: ele.event_start,
        description: ele.event_description,
        owner: ele.event_owner,
        length: ele.event_length,
        location: ele.event_location
      }
      events.push(event);
    });
  }

  return (
  <div>
    <FullCalendar 
      plugins={[dayGridPlugin]}
      initialView='dayGridMonth'
      weekends={true}
      events={events}
    />
  </div>
  )
}

export default CalendarView;