package uk.ac.bham.teamproject.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import uk.ac.bham.teamproject.web.rest.TestUtil;

class ScheduleEventTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ScheduleEvent.class);
        ScheduleEvent scheduleEvent1 = new ScheduleEvent();
        scheduleEvent1.setId(1L);
        ScheduleEvent scheduleEvent2 = new ScheduleEvent();
        scheduleEvent2.setId(scheduleEvent1.getId());
        assertThat(scheduleEvent1).isEqualTo(scheduleEvent2);
        scheduleEvent2.setId(2L);
        assertThat(scheduleEvent1).isNotEqualTo(scheduleEvent2);
        scheduleEvent1.setId(null);
        assertThat(scheduleEvent1).isNotEqualTo(scheduleEvent2);
    }
}
