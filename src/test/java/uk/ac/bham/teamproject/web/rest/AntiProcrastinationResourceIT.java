package uk.ac.bham.teamproject.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import uk.ac.bham.teamproject.IntegrationTest;
import uk.ac.bham.teamproject.domain.AntiProcrastination;
import uk.ac.bham.teamproject.repository.AntiProcrastinationRepository;

/**
 * Integration tests for the {@link AntiProcrastinationResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class AntiProcrastinationResourceIT {

    private static final String DEFAULT_URL = "AAAAAAAAAA";
    private static final String UPDATED_URL = "BBBBBBBBBB";

    private static final Boolean DEFAULT_TYPE = false;
    private static final Boolean UPDATED_TYPE = true;

    private static final Integer DEFAULT_DAYS = 1;
    private static final Integer UPDATED_DAYS = 2;

    private static final Integer DEFAULT_HOURS = 1;
    private static final Integer UPDATED_HOURS = 2;

    private static final Integer DEFAULT_MINUTES = 1;
    private static final Integer UPDATED_MINUTES = 2;

    private static final Integer DEFAULT_SECONDS = 1;
    private static final Integer UPDATED_SECONDS = 2;

    private static final String ENTITY_API_URL = "/api/anti-procrastinations";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private AntiProcrastinationRepository antiProcrastinationRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAntiProcrastinationMockMvc;

    private AntiProcrastination antiProcrastination;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AntiProcrastination createEntity(EntityManager em) {
        AntiProcrastination antiProcrastination = new AntiProcrastination()
            .url(DEFAULT_URL)
            .type(DEFAULT_TYPE)
            .days(DEFAULT_DAYS)
            .hours(DEFAULT_HOURS)
            .minutes(DEFAULT_MINUTES)
            .seconds(DEFAULT_SECONDS);
        return antiProcrastination;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AntiProcrastination createUpdatedEntity(EntityManager em) {
        AntiProcrastination antiProcrastination = new AntiProcrastination()
            .url(UPDATED_URL)
            .type(UPDATED_TYPE)
            .days(UPDATED_DAYS)
            .hours(UPDATED_HOURS)
            .minutes(UPDATED_MINUTES)
            .seconds(UPDATED_SECONDS);
        return antiProcrastination;
    }

    @BeforeEach
    public void initTest() {
        antiProcrastination = createEntity(em);
    }

    @Test
    @Transactional
    void createAntiProcrastination() throws Exception {
        int databaseSizeBeforeCreate = antiProcrastinationRepository.findAll().size();
        // Create the AntiProcrastination
        restAntiProcrastinationMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(antiProcrastination))
            )
            .andExpect(status().isCreated());

        // Validate the AntiProcrastination in the database
        List<AntiProcrastination> antiProcrastinationList = antiProcrastinationRepository.findAll();
        assertThat(antiProcrastinationList).hasSize(databaseSizeBeforeCreate + 1);
        AntiProcrastination testAntiProcrastination = antiProcrastinationList.get(antiProcrastinationList.size() - 1);
        assertThat(testAntiProcrastination.getUrl()).isEqualTo(DEFAULT_URL);
        assertThat(testAntiProcrastination.getType()).isEqualTo(DEFAULT_TYPE);
        assertThat(testAntiProcrastination.getDays()).isEqualTo(DEFAULT_DAYS);
        assertThat(testAntiProcrastination.getHours()).isEqualTo(DEFAULT_HOURS);
        assertThat(testAntiProcrastination.getMinutes()).isEqualTo(DEFAULT_MINUTES);
        assertThat(testAntiProcrastination.getSeconds()).isEqualTo(DEFAULT_SECONDS);
    }

    @Test
    @Transactional
    void createAntiProcrastinationWithExistingId() throws Exception {
        // Create the AntiProcrastination with an existing ID
        antiProcrastination.setId(1L);

        int databaseSizeBeforeCreate = antiProcrastinationRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAntiProcrastinationMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(antiProcrastination))
            )
            .andExpect(status().isBadRequest());

        // Validate the AntiProcrastination in the database
        List<AntiProcrastination> antiProcrastinationList = antiProcrastinationRepository.findAll();
        assertThat(antiProcrastinationList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkUrlIsRequired() throws Exception {
        int databaseSizeBeforeTest = antiProcrastinationRepository.findAll().size();
        // set the field null
        antiProcrastination.setUrl(null);

        // Create the AntiProcrastination, which fails.

        restAntiProcrastinationMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(antiProcrastination))
            )
            .andExpect(status().isBadRequest());

        List<AntiProcrastination> antiProcrastinationList = antiProcrastinationRepository.findAll();
        assertThat(antiProcrastinationList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkTypeIsRequired() throws Exception {
        int databaseSizeBeforeTest = antiProcrastinationRepository.findAll().size();
        // set the field null
        antiProcrastination.setType(null);

        // Create the AntiProcrastination, which fails.

        restAntiProcrastinationMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(antiProcrastination))
            )
            .andExpect(status().isBadRequest());

        List<AntiProcrastination> antiProcrastinationList = antiProcrastinationRepository.findAll();
        assertThat(antiProcrastinationList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkDaysIsRequired() throws Exception {
        int databaseSizeBeforeTest = antiProcrastinationRepository.findAll().size();
        // set the field null
        antiProcrastination.setDays(null);

        // Create the AntiProcrastination, which fails.

        restAntiProcrastinationMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(antiProcrastination))
            )
            .andExpect(status().isBadRequest());

        List<AntiProcrastination> antiProcrastinationList = antiProcrastinationRepository.findAll();
        assertThat(antiProcrastinationList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkHoursIsRequired() throws Exception {
        int databaseSizeBeforeTest = antiProcrastinationRepository.findAll().size();
        // set the field null
        antiProcrastination.setHours(null);

        // Create the AntiProcrastination, which fails.

        restAntiProcrastinationMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(antiProcrastination))
            )
            .andExpect(status().isBadRequest());

        List<AntiProcrastination> antiProcrastinationList = antiProcrastinationRepository.findAll();
        assertThat(antiProcrastinationList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkMinutesIsRequired() throws Exception {
        int databaseSizeBeforeTest = antiProcrastinationRepository.findAll().size();
        // set the field null
        antiProcrastination.setMinutes(null);

        // Create the AntiProcrastination, which fails.

        restAntiProcrastinationMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(antiProcrastination))
            )
            .andExpect(status().isBadRequest());

        List<AntiProcrastination> antiProcrastinationList = antiProcrastinationRepository.findAll();
        assertThat(antiProcrastinationList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkSecondsIsRequired() throws Exception {
        int databaseSizeBeforeTest = antiProcrastinationRepository.findAll().size();
        // set the field null
        antiProcrastination.setSeconds(null);

        // Create the AntiProcrastination, which fails.

        restAntiProcrastinationMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(antiProcrastination))
            )
            .andExpect(status().isBadRequest());

        List<AntiProcrastination> antiProcrastinationList = antiProcrastinationRepository.findAll();
        assertThat(antiProcrastinationList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllAntiProcrastinations() throws Exception {
        // Initialize the database
        antiProcrastinationRepository.saveAndFlush(antiProcrastination);

        // Get all the antiProcrastinationList
        restAntiProcrastinationMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(antiProcrastination.getId().intValue())))
            .andExpect(jsonPath("$.[*].url").value(hasItem(DEFAULT_URL)))
            .andExpect(jsonPath("$.[*].type").value(hasItem(DEFAULT_TYPE.booleanValue())))
            .andExpect(jsonPath("$.[*].days").value(hasItem(DEFAULT_DAYS)))
            .andExpect(jsonPath("$.[*].hours").value(hasItem(DEFAULT_HOURS)))
            .andExpect(jsonPath("$.[*].minutes").value(hasItem(DEFAULT_MINUTES)))
            .andExpect(jsonPath("$.[*].seconds").value(hasItem(DEFAULT_SECONDS)));
    }

    @Test
    @Transactional
    void getAntiProcrastination() throws Exception {
        // Initialize the database
        antiProcrastinationRepository.saveAndFlush(antiProcrastination);

        // Get the antiProcrastination
        restAntiProcrastinationMockMvc
            .perform(get(ENTITY_API_URL_ID, antiProcrastination.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(antiProcrastination.getId().intValue()))
            .andExpect(jsonPath("$.url").value(DEFAULT_URL))
            .andExpect(jsonPath("$.type").value(DEFAULT_TYPE.booleanValue()))
            .andExpect(jsonPath("$.days").value(DEFAULT_DAYS))
            .andExpect(jsonPath("$.hours").value(DEFAULT_HOURS))
            .andExpect(jsonPath("$.minutes").value(DEFAULT_MINUTES))
            .andExpect(jsonPath("$.seconds").value(DEFAULT_SECONDS));
    }

    @Test
    @Transactional
    void getNonExistingAntiProcrastination() throws Exception {
        // Get the antiProcrastination
        restAntiProcrastinationMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingAntiProcrastination() throws Exception {
        // Initialize the database
        antiProcrastinationRepository.saveAndFlush(antiProcrastination);

        int databaseSizeBeforeUpdate = antiProcrastinationRepository.findAll().size();

        // Update the antiProcrastination
        AntiProcrastination updatedAntiProcrastination = antiProcrastinationRepository.findById(antiProcrastination.getId()).get();
        // Disconnect from session so that the updates on updatedAntiProcrastination are not directly saved in db
        em.detach(updatedAntiProcrastination);
        updatedAntiProcrastination
            .url(UPDATED_URL)
            .type(UPDATED_TYPE)
            .days(UPDATED_DAYS)
            .hours(UPDATED_HOURS)
            .minutes(UPDATED_MINUTES)
            .seconds(UPDATED_SECONDS);

        restAntiProcrastinationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAntiProcrastination.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedAntiProcrastination))
            )
            .andExpect(status().isOk());

        // Validate the AntiProcrastination in the database
        List<AntiProcrastination> antiProcrastinationList = antiProcrastinationRepository.findAll();
        assertThat(antiProcrastinationList).hasSize(databaseSizeBeforeUpdate);
        AntiProcrastination testAntiProcrastination = antiProcrastinationList.get(antiProcrastinationList.size() - 1);
        assertThat(testAntiProcrastination.getUrl()).isEqualTo(UPDATED_URL);
        assertThat(testAntiProcrastination.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testAntiProcrastination.getDays()).isEqualTo(UPDATED_DAYS);
        assertThat(testAntiProcrastination.getHours()).isEqualTo(UPDATED_HOURS);
        assertThat(testAntiProcrastination.getMinutes()).isEqualTo(UPDATED_MINUTES);
        assertThat(testAntiProcrastination.getSeconds()).isEqualTo(UPDATED_SECONDS);
    }

    @Test
    @Transactional
    void putNonExistingAntiProcrastination() throws Exception {
        int databaseSizeBeforeUpdate = antiProcrastinationRepository.findAll().size();
        antiProcrastination.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAntiProcrastinationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, antiProcrastination.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(antiProcrastination))
            )
            .andExpect(status().isBadRequest());

        // Validate the AntiProcrastination in the database
        List<AntiProcrastination> antiProcrastinationList = antiProcrastinationRepository.findAll();
        assertThat(antiProcrastinationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAntiProcrastination() throws Exception {
        int databaseSizeBeforeUpdate = antiProcrastinationRepository.findAll().size();
        antiProcrastination.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAntiProcrastinationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(antiProcrastination))
            )
            .andExpect(status().isBadRequest());

        // Validate the AntiProcrastination in the database
        List<AntiProcrastination> antiProcrastinationList = antiProcrastinationRepository.findAll();
        assertThat(antiProcrastinationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAntiProcrastination() throws Exception {
        int databaseSizeBeforeUpdate = antiProcrastinationRepository.findAll().size();
        antiProcrastination.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAntiProcrastinationMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(antiProcrastination))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the AntiProcrastination in the database
        List<AntiProcrastination> antiProcrastinationList = antiProcrastinationRepository.findAll();
        assertThat(antiProcrastinationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAntiProcrastinationWithPatch() throws Exception {
        // Initialize the database
        antiProcrastinationRepository.saveAndFlush(antiProcrastination);

        int databaseSizeBeforeUpdate = antiProcrastinationRepository.findAll().size();

        // Update the antiProcrastination using partial update
        AntiProcrastination partialUpdatedAntiProcrastination = new AntiProcrastination();
        partialUpdatedAntiProcrastination.setId(antiProcrastination.getId());

        partialUpdatedAntiProcrastination
            .url(UPDATED_URL)
            .type(UPDATED_TYPE)
            .days(UPDATED_DAYS)
            .minutes(UPDATED_MINUTES)
            .seconds(UPDATED_SECONDS);

        restAntiProcrastinationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAntiProcrastination.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAntiProcrastination))
            )
            .andExpect(status().isOk());

        // Validate the AntiProcrastination in the database
        List<AntiProcrastination> antiProcrastinationList = antiProcrastinationRepository.findAll();
        assertThat(antiProcrastinationList).hasSize(databaseSizeBeforeUpdate);
        AntiProcrastination testAntiProcrastination = antiProcrastinationList.get(antiProcrastinationList.size() - 1);
        assertThat(testAntiProcrastination.getUrl()).isEqualTo(UPDATED_URL);
        assertThat(testAntiProcrastination.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testAntiProcrastination.getDays()).isEqualTo(UPDATED_DAYS);
        assertThat(testAntiProcrastination.getHours()).isEqualTo(DEFAULT_HOURS);
        assertThat(testAntiProcrastination.getMinutes()).isEqualTo(UPDATED_MINUTES);
        assertThat(testAntiProcrastination.getSeconds()).isEqualTo(UPDATED_SECONDS);
    }

    @Test
    @Transactional
    void fullUpdateAntiProcrastinationWithPatch() throws Exception {
        // Initialize the database
        antiProcrastinationRepository.saveAndFlush(antiProcrastination);

        int databaseSizeBeforeUpdate = antiProcrastinationRepository.findAll().size();

        // Update the antiProcrastination using partial update
        AntiProcrastination partialUpdatedAntiProcrastination = new AntiProcrastination();
        partialUpdatedAntiProcrastination.setId(antiProcrastination.getId());

        partialUpdatedAntiProcrastination
            .url(UPDATED_URL)
            .type(UPDATED_TYPE)
            .days(UPDATED_DAYS)
            .hours(UPDATED_HOURS)
            .minutes(UPDATED_MINUTES)
            .seconds(UPDATED_SECONDS);

        restAntiProcrastinationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAntiProcrastination.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAntiProcrastination))
            )
            .andExpect(status().isOk());

        // Validate the AntiProcrastination in the database
        List<AntiProcrastination> antiProcrastinationList = antiProcrastinationRepository.findAll();
        assertThat(antiProcrastinationList).hasSize(databaseSizeBeforeUpdate);
        AntiProcrastination testAntiProcrastination = antiProcrastinationList.get(antiProcrastinationList.size() - 1);
        assertThat(testAntiProcrastination.getUrl()).isEqualTo(UPDATED_URL);
        assertThat(testAntiProcrastination.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testAntiProcrastination.getDays()).isEqualTo(UPDATED_DAYS);
        assertThat(testAntiProcrastination.getHours()).isEqualTo(UPDATED_HOURS);
        assertThat(testAntiProcrastination.getMinutes()).isEqualTo(UPDATED_MINUTES);
        assertThat(testAntiProcrastination.getSeconds()).isEqualTo(UPDATED_SECONDS);
    }

    @Test
    @Transactional
    void patchNonExistingAntiProcrastination() throws Exception {
        int databaseSizeBeforeUpdate = antiProcrastinationRepository.findAll().size();
        antiProcrastination.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAntiProcrastinationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, antiProcrastination.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(antiProcrastination))
            )
            .andExpect(status().isBadRequest());

        // Validate the AntiProcrastination in the database
        List<AntiProcrastination> antiProcrastinationList = antiProcrastinationRepository.findAll();
        assertThat(antiProcrastinationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAntiProcrastination() throws Exception {
        int databaseSizeBeforeUpdate = antiProcrastinationRepository.findAll().size();
        antiProcrastination.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAntiProcrastinationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(antiProcrastination))
            )
            .andExpect(status().isBadRequest());

        // Validate the AntiProcrastination in the database
        List<AntiProcrastination> antiProcrastinationList = antiProcrastinationRepository.findAll();
        assertThat(antiProcrastinationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAntiProcrastination() throws Exception {
        int databaseSizeBeforeUpdate = antiProcrastinationRepository.findAll().size();
        antiProcrastination.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAntiProcrastinationMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(antiProcrastination))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the AntiProcrastination in the database
        List<AntiProcrastination> antiProcrastinationList = antiProcrastinationRepository.findAll();
        assertThat(antiProcrastinationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAntiProcrastination() throws Exception {
        // Initialize the database
        antiProcrastinationRepository.saveAndFlush(antiProcrastination);

        int databaseSizeBeforeDelete = antiProcrastinationRepository.findAll().size();

        // Delete the antiProcrastination
        restAntiProcrastinationMockMvc
            .perform(delete(ENTITY_API_URL_ID, antiProcrastination.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<AntiProcrastination> antiProcrastinationList = antiProcrastinationRepository.findAll();
        assertThat(antiProcrastinationList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
