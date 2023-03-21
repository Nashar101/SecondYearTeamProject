package uk.ac.bham.teamproject.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

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
import uk.ac.bham.teamproject.domain.Alarm;
import uk.ac.bham.teamproject.repository.AlarmRepository;

/**
 * Integration tests for the {@link AlarmResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class AlarmResourceIT {

    private static final String DEFAULT_ALARM_NAME = "AAAAAAAAAA";
    private static final String UPDATED_ALARM_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_TYPE = "AAAAAAAAAA";
    private static final String UPDATED_TYPE = "BBBBBBBBBB";

    private static final Integer DEFAULT_HOURS = 1;
    private static final Integer UPDATED_HOURS = 2;

    private static final Integer DEFAULT_MINUTES = 1;
    private static final Integer UPDATED_MINUTES = 2;

    private static final Integer DEFAULT_SECONDS = 1;
    private static final Integer UPDATED_SECONDS = 2;

    private static final String ENTITY_API_URL = "/api/alarms";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private AlarmRepository alarmRepository;

    @Mock
    private AlarmRepository alarmRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAlarmMockMvc;

    private Alarm alarm;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Alarm createEntity(EntityManager em) {
        Alarm alarm = new Alarm()
            .alarmName(DEFAULT_ALARM_NAME)
            .type(DEFAULT_TYPE)
            .hours(DEFAULT_HOURS)
            .minutes(DEFAULT_MINUTES)
            .seconds(DEFAULT_SECONDS);
        return alarm;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Alarm createUpdatedEntity(EntityManager em) {
        Alarm alarm = new Alarm()
            .alarmName(UPDATED_ALARM_NAME)
            .type(UPDATED_TYPE)
            .hours(UPDATED_HOURS)
            .minutes(UPDATED_MINUTES)
            .seconds(UPDATED_SECONDS);
        return alarm;
    }

    @BeforeEach
    public void initTest() {
        alarm = createEntity(em);
    }

    @Test
    @Transactional
    void createAlarm() throws Exception {
        int databaseSizeBeforeCreate = alarmRepository.findAll().size();
        // Create the Alarm
        restAlarmMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(alarm)))
            .andExpect(status().isCreated());

        // Validate the Alarm in the database
        List<Alarm> alarmList = alarmRepository.findAll();
        assertThat(alarmList).hasSize(databaseSizeBeforeCreate + 1);
        Alarm testAlarm = alarmList.get(alarmList.size() - 1);
        assertThat(testAlarm.getAlarmName()).isEqualTo(DEFAULT_ALARM_NAME);
        assertThat(testAlarm.getType()).isEqualTo(DEFAULT_TYPE);
        assertThat(testAlarm.getHours()).isEqualTo(DEFAULT_HOURS);
        assertThat(testAlarm.getMinutes()).isEqualTo(DEFAULT_MINUTES);
        assertThat(testAlarm.getSeconds()).isEqualTo(DEFAULT_SECONDS);
    }

    @Test
    @Transactional
    void createAlarmWithExistingId() throws Exception {
        // Create the Alarm with an existing ID
        alarm.setId(1L);

        int databaseSizeBeforeCreate = alarmRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAlarmMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(alarm)))
            .andExpect(status().isBadRequest());

        // Validate the Alarm in the database
        List<Alarm> alarmList = alarmRepository.findAll();
        assertThat(alarmList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllAlarms() throws Exception {
        // Initialize the database
        alarmRepository.saveAndFlush(alarm);

        // Get all the alarmList
        restAlarmMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(alarm.getId().intValue())))
            .andExpect(jsonPath("$.[*].alarmName").value(hasItem(DEFAULT_ALARM_NAME)))
            .andExpect(jsonPath("$.[*].type").value(hasItem(DEFAULT_TYPE)))
            .andExpect(jsonPath("$.[*].hours").value(hasItem(DEFAULT_HOURS)))
            .andExpect(jsonPath("$.[*].minutes").value(hasItem(DEFAULT_MINUTES)))
            .andExpect(jsonPath("$.[*].seconds").value(hasItem(DEFAULT_SECONDS)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllAlarmsWithEagerRelationshipsIsEnabled() throws Exception {
        when(alarmRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restAlarmMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(alarmRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllAlarmsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(alarmRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restAlarmMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(alarmRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getAlarm() throws Exception {
        // Initialize the database
        alarmRepository.saveAndFlush(alarm);

        // Get the alarm
        restAlarmMockMvc
            .perform(get(ENTITY_API_URL_ID, alarm.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(alarm.getId().intValue()))
            .andExpect(jsonPath("$.alarmName").value(DEFAULT_ALARM_NAME))
            .andExpect(jsonPath("$.type").value(DEFAULT_TYPE))
            .andExpect(jsonPath("$.hours").value(DEFAULT_HOURS))
            .andExpect(jsonPath("$.minutes").value(DEFAULT_MINUTES))
            .andExpect(jsonPath("$.seconds").value(DEFAULT_SECONDS));
    }

    @Test
    @Transactional
    void getNonExistingAlarm() throws Exception {
        // Get the alarm
        restAlarmMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingAlarm() throws Exception {
        // Initialize the database
        alarmRepository.saveAndFlush(alarm);

        int databaseSizeBeforeUpdate = alarmRepository.findAll().size();

        // Update the alarm
        Alarm updatedAlarm = alarmRepository.findById(alarm.getId()).get();
        // Disconnect from session so that the updates on updatedAlarm are not directly saved in db
        em.detach(updatedAlarm);
        updatedAlarm
            .alarmName(UPDATED_ALARM_NAME)
            .type(UPDATED_TYPE)
            .hours(UPDATED_HOURS)
            .minutes(UPDATED_MINUTES)
            .seconds(UPDATED_SECONDS);

        restAlarmMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAlarm.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedAlarm))
            )
            .andExpect(status().isOk());

        // Validate the Alarm in the database
        List<Alarm> alarmList = alarmRepository.findAll();
        assertThat(alarmList).hasSize(databaseSizeBeforeUpdate);
        Alarm testAlarm = alarmList.get(alarmList.size() - 1);
        assertThat(testAlarm.getAlarmName()).isEqualTo(UPDATED_ALARM_NAME);
        assertThat(testAlarm.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testAlarm.getHours()).isEqualTo(UPDATED_HOURS);
        assertThat(testAlarm.getMinutes()).isEqualTo(UPDATED_MINUTES);
        assertThat(testAlarm.getSeconds()).isEqualTo(UPDATED_SECONDS);
    }

    @Test
    @Transactional
    void putNonExistingAlarm() throws Exception {
        int databaseSizeBeforeUpdate = alarmRepository.findAll().size();
        alarm.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAlarmMockMvc
            .perform(
                put(ENTITY_API_URL_ID, alarm.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(alarm))
            )
            .andExpect(status().isBadRequest());

        // Validate the Alarm in the database
        List<Alarm> alarmList = alarmRepository.findAll();
        assertThat(alarmList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAlarm() throws Exception {
        int databaseSizeBeforeUpdate = alarmRepository.findAll().size();
        alarm.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAlarmMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(alarm))
            )
            .andExpect(status().isBadRequest());

        // Validate the Alarm in the database
        List<Alarm> alarmList = alarmRepository.findAll();
        assertThat(alarmList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAlarm() throws Exception {
        int databaseSizeBeforeUpdate = alarmRepository.findAll().size();
        alarm.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAlarmMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(alarm)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Alarm in the database
        List<Alarm> alarmList = alarmRepository.findAll();
        assertThat(alarmList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAlarmWithPatch() throws Exception {
        // Initialize the database
        alarmRepository.saveAndFlush(alarm);

        int databaseSizeBeforeUpdate = alarmRepository.findAll().size();

        // Update the alarm using partial update
        Alarm partialUpdatedAlarm = new Alarm();
        partialUpdatedAlarm.setId(alarm.getId());

        partialUpdatedAlarm.type(UPDATED_TYPE).hours(UPDATED_HOURS).minutes(UPDATED_MINUTES).seconds(UPDATED_SECONDS);

        restAlarmMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAlarm.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAlarm))
            )
            .andExpect(status().isOk());

        // Validate the Alarm in the database
        List<Alarm> alarmList = alarmRepository.findAll();
        assertThat(alarmList).hasSize(databaseSizeBeforeUpdate);
        Alarm testAlarm = alarmList.get(alarmList.size() - 1);
        assertThat(testAlarm.getAlarmName()).isEqualTo(DEFAULT_ALARM_NAME);
        assertThat(testAlarm.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testAlarm.getHours()).isEqualTo(UPDATED_HOURS);
        assertThat(testAlarm.getMinutes()).isEqualTo(UPDATED_MINUTES);
        assertThat(testAlarm.getSeconds()).isEqualTo(UPDATED_SECONDS);
    }

    @Test
    @Transactional
    void fullUpdateAlarmWithPatch() throws Exception {
        // Initialize the database
        alarmRepository.saveAndFlush(alarm);

        int databaseSizeBeforeUpdate = alarmRepository.findAll().size();

        // Update the alarm using partial update
        Alarm partialUpdatedAlarm = new Alarm();
        partialUpdatedAlarm.setId(alarm.getId());

        partialUpdatedAlarm
            .alarmName(UPDATED_ALARM_NAME)
            .type(UPDATED_TYPE)
            .hours(UPDATED_HOURS)
            .minutes(UPDATED_MINUTES)
            .seconds(UPDATED_SECONDS);

        restAlarmMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAlarm.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAlarm))
            )
            .andExpect(status().isOk());

        // Validate the Alarm in the database
        List<Alarm> alarmList = alarmRepository.findAll();
        assertThat(alarmList).hasSize(databaseSizeBeforeUpdate);
        Alarm testAlarm = alarmList.get(alarmList.size() - 1);
        assertThat(testAlarm.getAlarmName()).isEqualTo(UPDATED_ALARM_NAME);
        assertThat(testAlarm.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testAlarm.getHours()).isEqualTo(UPDATED_HOURS);
        assertThat(testAlarm.getMinutes()).isEqualTo(UPDATED_MINUTES);
        assertThat(testAlarm.getSeconds()).isEqualTo(UPDATED_SECONDS);
    }

    @Test
    @Transactional
    void patchNonExistingAlarm() throws Exception {
        int databaseSizeBeforeUpdate = alarmRepository.findAll().size();
        alarm.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAlarmMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, alarm.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(alarm))
            )
            .andExpect(status().isBadRequest());

        // Validate the Alarm in the database
        List<Alarm> alarmList = alarmRepository.findAll();
        assertThat(alarmList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAlarm() throws Exception {
        int databaseSizeBeforeUpdate = alarmRepository.findAll().size();
        alarm.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAlarmMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(alarm))
            )
            .andExpect(status().isBadRequest());

        // Validate the Alarm in the database
        List<Alarm> alarmList = alarmRepository.findAll();
        assertThat(alarmList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAlarm() throws Exception {
        int databaseSizeBeforeUpdate = alarmRepository.findAll().size();
        alarm.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAlarmMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(alarm)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Alarm in the database
        List<Alarm> alarmList = alarmRepository.findAll();
        assertThat(alarmList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAlarm() throws Exception {
        // Initialize the database
        alarmRepository.saveAndFlush(alarm);

        int databaseSizeBeforeDelete = alarmRepository.findAll().size();

        // Delete the alarm
        restAlarmMockMvc
            .perform(delete(ENTITY_API_URL_ID, alarm.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Alarm> alarmList = alarmRepository.findAll();
        assertThat(alarmList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
