import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FullCalendar from '@fullcalendar/react';
import listPlugin from '@fullcalendar/list';

const EventView = (props) => {
  const events = [];

  // console.log('eventdata', props.eventData, 'eventinvite', props.eventInviteData, 'userInvite', props.userInviteData);

  if (props.userInviteData) {
    for (let i = 0; i < props.userInviteData.length; i++) {
      const ele = props.userInviteData[i];
      const eventInvitees = [];
      // const inviteResults = props.getEventInvites(ele.id);
      // console.log(inviteResults, props.eventInviteData);
      // for (let i = 0; i < inviteResults.length; i++) {
      //   const invite = inviteResults[i];
      //   const fullName = `${invite.first_name} ${invite.last_name}`;
      //   eventInvitees.push(fullName);
      // }
      const event = {
        eventId: ele.id,
        title: ele.event_name,
        start: ele.event_start,
        description: ele.event_description,
        owner: ele.event_owner,
        length: ele.event_length,
        location: ele.event_location,
        invitees: eventInvitees
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
      eventClick={props.openEditForm}
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
      <br />
      Invitees: {eventInfo.event.extendedProps.invitees.length}
    </>
  )
}

export default EventView;