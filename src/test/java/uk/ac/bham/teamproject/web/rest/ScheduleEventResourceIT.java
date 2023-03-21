package uk.ac.bham.teamproject.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static uk.ac.bham.teamproject.web.rest.TestUtil.sameInstant;

import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import uk.ac.bham.teamproject.IntegrationTest;
import uk.ac.bham.teamproject.domain.ScheduleEvent;
import uk.ac.bham.teamproject.repository.ScheduleEventRepository;

/**
 * Integration tests for the {@link ScheduleEventResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class ScheduleEventResourceIT {

    private static final Instant DEFAULT_START_TIME = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_START_TIME = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Instant DEFAULT_END_TIME = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_END_TIME = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String DEFAULT_HEADING = "AAAAAAAAAA";
    private static final String UPDATED_HEADING = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String DEFAULT_DETAILS = "AAAAAAAAAA";
    private static final String UPDATED_DETAILS = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/schedule-events";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ScheduleEventRepository scheduleEventRepository;

    @Mock
    private ScheduleEventRepository scheduleEventRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restScheduleEventMockMvc;

    private ScheduleEvent scheduleEvent;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ScheduleEvent createEntity(EntityManager em) {
        ScheduleEvent scheduleEvent = new ScheduleEvent()
            .startTime(DEFAULT_START_TIME)
            .endTime(DEFAULT_END_TIME)
            .heading(DEFAULT_HEADING)
            .date(DEFAULT_DATE)
            .details(DEFAULT_DETAILS);
        return scheduleEvent;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ScheduleEvent createUpdatedEntity(EntityManager em) {
        ScheduleEvent scheduleEvent = new ScheduleEvent()
            .startTime(UPDATED_START_TIME)
            .endTime(UPDATED_END_TIME)
            .heading(UPDATED_HEADING)
            .date(UPDATED_DATE)
            .details(UPDATED_DETAILS);
        return scheduleEvent;
    }

    @BeforeEach
    public void initTest() {
        scheduleEvent = createEntity(em);
    }

    @Test
    @Transactional
    void createScheduleEvent() throws Exception {
        int databaseSizeBeforeCreate = scheduleEventRepository.findAll().size();
        // Create the ScheduleEvent
        restScheduleEventMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(scheduleEvent)))
            .andExpect(status().isCreated());

        // Validate the ScheduleEvent in the database
        List<ScheduleEvent> scheduleEventList = scheduleEventRepository.findAll();
        assertThat(scheduleEventList).hasSize(databaseSizeBeforeCreate + 1);
        ScheduleEvent testScheduleEvent = scheduleEventList.get(scheduleEventList.size() - 1);
        assertThat(testScheduleEvent.getStartTime()).isEqualTo(DEFAULT_START_TIME);
        assertThat(testScheduleEvent.getEndTime()).isEqualTo(DEFAULT_END_TIME);
        assertThat(testScheduleEvent.getHeading()).isEqualTo(DEFAULT_HEADING);
        assertThat(testScheduleEvent.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testScheduleEvent.getDetails()).isEqualTo(DEFAULT_DETAILS);
    }

    @Test
    @Transactional
    void createScheduleEventWithExistingId() throws Exception {
        // Create the ScheduleEvent with an existing ID
        scheduleEvent.setId(1L);

        int databaseSizeBeforeCreate = scheduleEventRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restScheduleEventMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(scheduleEvent)))
            .andExpect(status().isBadRequest());

        // Validate the ScheduleEvent in the database
        List<ScheduleEvent> scheduleEventList = scheduleEventRepository.findAll();
        assertThat(scheduleEventList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllScheduleEvents() throws Exception {
        // Initialize the database
        scheduleEventRepository.saveAndFlush(scheduleEvent);

        // Get all the scheduleEventList
        restScheduleEventMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(scheduleEvent.getId().intValue())))
            .andExpect(jsonPath("$.[*].startTime").value(hasItem(DEFAULT_START_TIME.toString())))
            .andExpect(jsonPath("$.[*].endTime").value(hasItem(DEFAULT_END_TIME.toString())))
            .andExpect(jsonPath("$.[*].heading").value(hasItem(DEFAULT_HEADING)))
            .andExpect(jsonPath("$.[*].date").value(hasItem(sameInstant(DEFAULT_DATE))))
            .andExpect(jsonPath("$.[*].details").value(hasItem(DEFAULT_DETAILS)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllScheduleEventsWithEagerRelationshipsIsEnabled() throws Exception {
        when(scheduleEventRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restScheduleEventMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(scheduleEventRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllScheduleEventsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(scheduleEventRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restScheduleEventMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(scheduleEventRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getScheduleEvent() throws Exception {
        // Initialize the database
        scheduleEventRepository.saveAndFlush(scheduleEvent);

        // Get the scheduleEvent
        restScheduleEventMockMvc
            .perform(get(ENTITY_API_URL_ID, scheduleEvent.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(scheduleEvent.getId().intValue()))
            .andExpect(jsonPath("$.startTime").value(DEFAULT_START_TIME.toString()))
            .andExpect(jsonPath("$.endTime").value(DEFAULT_END_TIME.toString()))
            .andExpect(jsonPath("$.heading").value(DEFAULT_HEADING))
            .andExpect(jsonPath("$.date").value(sameInstant(DEFAULT_DATE)))
            .andExpect(jsonPath("$.details").value(DEFAULT_DETAILS));
    }

    @Test
    @Transactional
    void getNonExistingScheduleEvent() throws Exception {
        // Get the scheduleEvent
        restScheduleEventMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingScheduleEvent() throws Exception {
        // Initialize the database
        scheduleEventRepository.saveAndFlush(scheduleEvent);

        int databaseSizeBeforeUpdate = scheduleEventRepository.findAll().size();

        // Update the scheduleEvent
        ScheduleEvent updatedScheduleEvent = scheduleEventRepository.findById(scheduleEvent.getId()).get();
        // Disconnect from session so that the updates on updatedScheduleEvent are not directly saved in db
        em.detach(updatedScheduleEvent);
        updatedScheduleEvent
            .startTime(UPDATED_START_TIME)
            .endTime(UPDATED_END_TIME)
            .heading(UPDATED_HEADING)
            .date(UPDATED_DATE)
            .details(UPDATED_DETAILS);

        restScheduleEventMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedScheduleEvent.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedScheduleEvent))
            )
            .andExpect(status().isOk());

        // Validate the ScheduleEvent in the database
        List<ScheduleEvent> scheduleEventList = scheduleEventRepository.findAll();
        assertThat(scheduleEventList).hasSize(databaseSizeBeforeUpdate);
        ScheduleEvent testScheduleEvent = scheduleEventList.get(scheduleEventList.size() - 1);
        assertThat(testScheduleEvent.getStartTime()).isEqualTo(UPDATED_START_TIME);
        assertThat(testScheduleEvent.getEndTime()).isEqualTo(UPDATED_END_TIME);
        assertThat(testScheduleEvent.getHeading()).isEqualTo(UPDATED_HEADING);
        assertThat(testScheduleEvent.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testScheduleEvent.getDetails()).isEqualTo(UPDATED_DETAILS);
    }

    @Test
    @Transactional
    void putNonExistingScheduleEvent() throws Exception {
        int databaseSizeBeforeUpdate = scheduleEventRepository.findAll().size();
        scheduleEvent.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restScheduleEventMockMvc
            .perform(
                put(ENTITY_API_URL_ID, scheduleEvent.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(scheduleEvent))
            )
            .andExpect(status().isBadRequest());

        // Validate the ScheduleEvent in the database
        List<ScheduleEvent> scheduleEventList = scheduleEventRepository.findAll();
        assertThat(scheduleEventList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchScheduleEvent() throws Exception {
        int databaseSizeBeforeUpdate = scheduleEventRepository.findAll().size();
        scheduleEvent.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restScheduleEventMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(scheduleEvent))
            )
            .andExpect(status().isBadRequest());

        // Validate the ScheduleEvent in the database
        List<ScheduleEvent> scheduleEventList = scheduleEventRepository.findAll();
        assertThat(scheduleEventList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamScheduleEvent() throws Exception {
        int databaseSizeBeforeUpdate = scheduleEventRepository.findAll().size();
        scheduleEvent.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restScheduleEventMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(scheduleEvent)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the ScheduleEvent in the database
        List<ScheduleEvent> scheduleEventList = scheduleEventRepository.findAll();
        assertThat(scheduleEventList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateScheduleEventWithPatch() throws Exception {
        // Initialize the database
        scheduleEventRepository.saveAndFlush(scheduleEvent);

        int databaseSizeBeforeUpdate = scheduleEventRepository.findAll().size();

        // Update the scheduleEvent using partial update
        ScheduleEvent partialUpdatedScheduleEvent = new ScheduleEvent();
        partialUpdatedScheduleEvent.setId(scheduleEvent.getId());

        partialUpdatedScheduleEvent.endTime(UPDATED_END_TIME).date(UPDATED_DATE).details(UPDATED_DETAILS);

        restScheduleEventMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedScheduleEvent.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedScheduleEvent))
            )
            .andExpect(status().isOk());

        // Validate the ScheduleEvent in the database
        List<ScheduleEvent> scheduleEventList = scheduleEventRepository.findAll();
        assertThat(scheduleEventList).hasSize(databaseSizeBeforeUpdate);
        ScheduleEvent testScheduleEvent = scheduleEventList.get(scheduleEventList.size() - 1);
        assertThat(testScheduleEvent.getStartTime()).isEqualTo(DEFAULT_START_TIME);
        assertThat(testScheduleEvent.getEndTime()).isEqualTo(UPDATED_END_TIME);
        assertThat(testScheduleEvent.getHeading()).isEqualTo(DEFAULT_HEADING);
        assertThat(testScheduleEvent.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testScheduleEvent.getDetails()).isEqualTo(UPDATED_DETAILS);
    }

    @Test
    @Transactional
    void fullUpdateScheduleEventWithPatch() throws Exception {
        // Initialize the database
        scheduleEventRepository.saveAndFlush(scheduleEvent);

        int databaseSizeBeforeUpdate = scheduleEventRepository.findAll().size();

        // Update the scheduleEvent using partial update
        ScheduleEvent partialUpdatedScheduleEvent = new ScheduleEvent();
        partialUpdatedScheduleEvent.setId(scheduleEvent.getId());

        partialUpdatedScheduleEvent
            .startTime(UPDATED_START_TIME)
            .endTime(UPDATED_END_TIME)
            .heading(UPDATED_HEADING)
            .date(UPDATED_DATE)
            .details(UPDATED_DETAILS);

        restScheduleEventMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedScheduleEvent.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedScheduleEvent))
            )
            .andExpect(status().isOk());

        // Validate the ScheduleEvent in the database
        List<ScheduleEvent> scheduleEventList = scheduleEventRepository.findAll();
        assertThat(scheduleEventList).hasSize(databaseSizeBeforeUpdate);
        ScheduleEvent testScheduleEvent = scheduleEventList.get(scheduleEventList.size() - 1);
        assertThat(testScheduleEvent.getStartTime()).isEqualTo(UPDATED_START_TIME);
        assertThat(testScheduleEvent.getEndTime()).isEqualTo(UPDATED_END_TIME);
        assertThat(testScheduleEvent.getHeading()).isEqualTo(UPDATED_HEADING);
        assertThat(testScheduleEvent.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testScheduleEvent.getDetails()).isEqualTo(UPDATED_DETAILS);
    }

    @Test
    @Transactional
    void patchNonExistingScheduleEvent() throws Exception {
        int databaseSizeBeforeUpdate = scheduleEventRepository.findAll().size();
        scheduleEvent.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restScheduleEventMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, scheduleEvent.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(scheduleEvent))
            )
            .andExpect(status().isBadRequest());

        // Validate the ScheduleEvent in the database
        List<ScheduleEvent> scheduleEventList = scheduleEventRepository.findAll();
        assertThat(scheduleEventList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchScheduleEvent() throws Exception {
        int databaseSizeBeforeUpdate = scheduleEventRepository.findAll().size();
        scheduleEvent.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restScheduleEventMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(scheduleEvent))
            )
            .andExpect(status().isBadRequest());

        // Validate the ScheduleEvent in the database
        List<ScheduleEvent> scheduleEventList = scheduleEventRepository.findAll();
        assertThat(scheduleEventList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamScheduleEvent() throws Exception {
        int databaseSizeBeforeUpdate = scheduleEventRepository.findAll().size();
        scheduleEvent.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restScheduleEventMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(scheduleEvent))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ScheduleEvent in the database
        List<ScheduleEvent> scheduleEventList = scheduleEventRepository.findAll();
        assertThat(scheduleEventList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteScheduleEvent() throws Exception {
        // Initialize the database
        scheduleEventRepository.saveAndFlush(scheduleEvent);

        int databaseSizeBeforeDelete = scheduleEventRepository.findAll().size();

        // Delete the scheduleEvent
        restScheduleEventMockMvc
            .perform(delete(ENTITY_API_URL_ID, scheduleEvent.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ScheduleEvent> scheduleEventList = scheduleEventRepository.findAll();
        assertThat(scheduleEventList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
