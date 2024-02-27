import React from 'react';
import FullCalendar from '@fullcalendar/react';
import listPlugin from '@fullcalendar/list';

const EventView = (props) => {
  const events = [];

  if (props.userInviteData) {
    for (let i = 0; i < props.userInviteData.length; i++) {
      const ele = props.userInviteData[i];
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
    }
  }
  
  return (
  <div>
    <FullCalendar 
      plugins={[listPlugin]}
      initialView='listMonth'
      weekends={true}
      events={events}
      eventContent={renderEventContent}
      eventClick={props.openEditEvent}
    />
  </div>
  )
}

function renderEventContent(eventInfo) {
  return (
    <>
      {eventInfo.timeText}
      Title: <b>{eventInfo.event.title}</b>
      <br />
      Event Description: {eventInfo.event.extendedProps.description}
      <br />
      Location: {eventInfo.event.extendedProps.location}
      <br />
      Length: {eventInfo.event.extendedProps.length} min
    </>
  )
}

export default EventView;