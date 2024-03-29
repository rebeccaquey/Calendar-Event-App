import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

const CalendarView = (props) => {
  const events = [];

  if (props.userInviteData) {
    props.userInviteData.forEach(ele => {
      const event = {
        eventId: ele.event_id,
        title: ele.event_name,
        start: ele.event_start,
        description: ele.event_description,
        owner: ele.event_owner,
        length: ele.event_length,
        location: ele.event_location,
        lastEdited: ele.last_edited
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
      eventClick={props.openEditEvent}
    />
  </div>
  )
}

export default CalendarView;