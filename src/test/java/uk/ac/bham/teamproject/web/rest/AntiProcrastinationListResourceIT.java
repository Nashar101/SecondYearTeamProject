package uk.ac.bham.teamproject.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static uk.ac.bham.teamproject.web.rest.TestUtil.sameInstant;

import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
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
import uk.ac.bham.teamproject.domain.AntiProcrastinationList;
import uk.ac.bham.teamproject.repository.AntiProcrastinationListRepository;

/**
 * Integration tests for the {@link AntiProcrastinationListResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class AntiProcrastinationListResourceIT {

    private static final String DEFAULT_LINK = "AAAAAAAAAA";
    private static final String UPDATED_LINK = "BBBBBBBBBB";

    private static final String DEFAULT_TYPE = "AAAAAAAAAA";
    private static final String UPDATED_TYPE = "BBBBBBBBBB";

    private static final Integer DEFAULT_DAYS = 1;
    private static final Integer UPDATED_DAYS = 2;

    private static final Integer DEFAULT_HOURS = 1;
    private static final Integer UPDATED_HOURS = 2;

    private static final Integer DEFAULT_MINUTES = 1;
    private static final Integer UPDATED_MINUTES = 2;

    private static final Integer DEFAULT_SECONDS = 1;
    private static final Integer UPDATED_SECONDS = 2;

    private static final String DEFAULT_EMPTY = "AAAAAAAAAA";
    private static final String UPDATED_EMPTY = "BBBBBBBBBB";

    private static final String DEFAULT_IDK = "AAAAAAAAAA";
    private static final String UPDATED_IDK = "BBBBBBBBBB";

    private static final String DEFAULT_IDK_1 = "AAAAAAAAAA";
    private static final String UPDATED_IDK_1 = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_DUE_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_DUE_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String ENTITY_API_URL = "/api/anti-procrastination-lists";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private AntiProcrastinationListRepository antiProcrastinationListRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAntiProcrastinationListMockMvc;

    private AntiProcrastinationList antiProcrastinationList;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AntiProcrastinationList createEntity(EntityManager em) {
        AntiProcrastinationList antiProcrastinationList = new AntiProcrastinationList()
            .link(DEFAULT_LINK)
            .type(DEFAULT_TYPE)
            .days(DEFAULT_DAYS)
            .hours(DEFAULT_HOURS)
            .minutes(DEFAULT_MINUTES)
            .seconds(DEFAULT_SECONDS)
            .empty(DEFAULT_EMPTY)
            .idk(DEFAULT_IDK)
            .idk1(DEFAULT_IDK_1)
            .dueDate(DEFAULT_DUE_DATE);
        return antiProcrastinationList;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AntiProcrastinationList createUpdatedEntity(EntityManager em) {
        AntiProcrastinationList antiProcrastinationList = new AntiProcrastinationList()
            .link(UPDATED_LINK)
            .type(UPDATED_TYPE)
            .days(UPDATED_DAYS)
            .hours(UPDATED_HOURS)
            .minutes(UPDATED_MINUTES)
            .seconds(UPDATED_SECONDS)
            .empty(UPDATED_EMPTY)
            .idk(UPDATED_IDK)
            .idk1(UPDATED_IDK_1)
            .dueDate(UPDATED_DUE_DATE);
        return antiProcrastinationList;
    }

    @BeforeEach
    public void initTest() {
        antiProcrastinationList = createEntity(em);
    }

    @Test
    @Transactional
    void createAntiProcrastinationList() throws Exception {
        int databaseSizeBeforeCreate = antiProcrastinationListRepository.findAll().size();
        // Create the AntiProcrastinationList
        restAntiProcrastinationListMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(antiProcrastinationList))
            )
            .andExpect(status().isCreated());

        // Validate the AntiProcrastinationList in the database
        List<AntiProcrastinationList> antiProcrastinationListList = antiProcrastinationListRepository.findAll();
        assertThat(antiProcrastinationListList).hasSize(databaseSizeBeforeCreate + 1);
        AntiProcrastinationList testAntiProcrastinationList = antiProcrastinationListList.get(antiProcrastinationListList.size() - 1);
        assertThat(testAntiProcrastinationList.getLink()).isEqualTo(DEFAULT_LINK);
        assertThat(testAntiProcrastinationList.getType()).isEqualTo(DEFAULT_TYPE);
        assertThat(testAntiProcrastinationList.getDays()).isEqualTo(DEFAULT_DAYS);
        assertThat(testAntiProcrastinationList.getHours()).isEqualTo(DEFAULT_HOURS);
        assertThat(testAntiProcrastinationList.getMinutes()).isEqualTo(DEFAULT_MINUTES);
        assertThat(testAntiProcrastinationList.getSeconds()).isEqualTo(DEFAULT_SECONDS);
        assertThat(testAntiProcrastinationList.getEmpty()).isEqualTo(DEFAULT_EMPTY);
        assertThat(testAntiProcrastinationList.getIdk()).isEqualTo(DEFAULT_IDK);
        assertThat(testAntiProcrastinationList.getIdk1()).isEqualTo(DEFAULT_IDK_1);
        assertThat(testAntiProcrastinationList.getDueDate()).isEqualTo(DEFAULT_DUE_DATE);
    }

    @Test
    @Transactional
    void createAntiProcrastinationListWithExistingId() throws Exception {
        // Create the AntiProcrastinationList with an existing ID
        antiProcrastinationList.setId(1L);

        int databaseSizeBeforeCreate = antiProcrastinationListRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAntiProcrastinationListMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(antiProcrastinationList))
            )
            .andExpect(status().isBadRequest());

        // Validate the AntiProcrastinationList in the database
        List<AntiProcrastinationList> antiProcrastinationListList = antiProcrastinationListRepository.findAll();
        assertThat(antiProcrastinationListList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllAntiProcrastinationLists() throws Exception {
        // Initialize the database
        antiProcrastinationListRepository.saveAndFlush(antiProcrastinationList);

        // Get all the antiProcrastinationListList
        restAntiProcrastinationListMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(antiProcrastinationList.getId().intValue())))
            .andExpect(jsonPath("$.[*].link").value(hasItem(DEFAULT_LINK)))
            .andExpect(jsonPath("$.[*].type").value(hasItem(DEFAULT_TYPE)))
            .andExpect(jsonPath("$.[*].days").value(hasItem(DEFAULT_DAYS)))
            .andExpect(jsonPath("$.[*].hours").value(hasItem(DEFAULT_HOURS)))
            .andExpect(jsonPath("$.[*].minutes").value(hasItem(DEFAULT_MINUTES)))
            .andExpect(jsonPath("$.[*].seconds").value(hasItem(DEFAULT_SECONDS)))
            .andExpect(jsonPath("$.[*].empty").value(hasItem(DEFAULT_EMPTY)))
            .andExpect(jsonPath("$.[*].idk").value(hasItem(DEFAULT_IDK)))
            .andExpect(jsonPath("$.[*].idk1").value(hasItem(DEFAULT_IDK_1)))
            .andExpect(jsonPath("$.[*].dueDate").value(hasItem(sameInstant(DEFAULT_DUE_DATE))));
    }

    @Test
    @Transactional
    void getAntiProcrastinationList() throws Exception {
        // Initialize the database
        antiProcrastinationListRepository.saveAndFlush(antiProcrastinationList);

        // Get the antiProcrastinationList
        restAntiProcrastinationListMockMvc
            .perform(get(ENTITY_API_URL_ID, antiProcrastinationList.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(antiProcrastinationList.getId().intValue()))
            .andExpect(jsonPath("$.link").value(DEFAULT_LINK))
            .andExpect(jsonPath("$.type").value(DEFAULT_TYPE))
            .andExpect(jsonPath("$.days").value(DEFAULT_DAYS))
            .andExpect(jsonPath("$.hours").value(DEFAULT_HOURS))
            .andExpect(jsonPath("$.minutes").value(DEFAULT_MINUTES))
            .andExpect(jsonPath("$.seconds").value(DEFAULT_SECONDS))
            .andExpect(jsonPath("$.empty").value(DEFAULT_EMPTY))
            .andExpect(jsonPath("$.idk").value(DEFAULT_IDK))
            .andExpect(jsonPath("$.idk1").value(DEFAULT_IDK_1))
            .andExpect(jsonPath("$.dueDate").value(sameInstant(DEFAULT_DUE_DATE)));
    }

    @Test
    @Transactional
    void getNonExistingAntiProcrastinationList() throws Exception {
        // Get the antiProcrastinationList
        restAntiProcrastinationListMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingAntiProcrastinationList() throws Exception {
        // Initialize the database
        antiProcrastinationListRepository.saveAndFlush(antiProcrastinationList);

        int databaseSizeBeforeUpdate = antiProcrastinationListRepository.findAll().size();

        // Update the antiProcrastinationList
        AntiProcrastinationList updatedAntiProcrastinationList = antiProcrastinationListRepository
            .findById(antiProcrastinationList.getId())
            .get();
        // Disconnect from session so that the updates on updatedAntiProcrastinationList are not directly saved in db
        em.detach(updatedAntiProcrastinationList);
        updatedAntiProcrastinationList
            .link(UPDATED_LINK)
            .type(UPDATED_TYPE)
            .days(UPDATED_DAYS)
            .hours(UPDATED_HOURS)
            .minutes(UPDATED_MINUTES)
            .seconds(UPDATED_SECONDS)
            .empty(UPDATED_EMPTY)
            .idk(UPDATED_IDK)
            .idk1(UPDATED_IDK_1)
            .dueDate(UPDATED_DUE_DATE);

        restAntiProcrastinationListMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAntiProcrastinationList.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedAntiProcrastinationList))
            )
            .andExpect(status().isOk());

        // Validate the AntiProcrastinationList in the database
        List<AntiProcrastinationList> antiProcrastinationListList = antiProcrastinationListRepository.findAll();
        assertThat(antiProcrastinationListList).hasSize(databaseSizeBeforeUpdate);
        AntiProcrastinationList testAntiProcrastinationList = antiProcrastinationListList.get(antiProcrastinationListList.size() - 1);
        assertThat(testAntiProcrastinationList.getLink()).isEqualTo(UPDATED_LINK);
        assertThat(testAntiProcrastinationList.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testAntiProcrastinationList.getDays()).isEqualTo(UPDATED_DAYS);
        assertThat(testAntiProcrastinationList.getHours()).isEqualTo(UPDATED_HOURS);
        assertThat(testAntiProcrastinationList.getMinutes()).isEqualTo(UPDATED_MINUTES);
        assertThat(testAntiProcrastinationList.getSeconds()).isEqualTo(UPDATED_SECONDS);
        assertThat(testAntiProcrastinationList.getEmpty()).isEqualTo(UPDATED_EMPTY);
        assertThat(testAntiProcrastinationList.getIdk()).isEqualTo(UPDATED_IDK);
        assertThat(testAntiProcrastinationList.getIdk1()).isEqualTo(UPDATED_IDK_1);
        assertThat(testAntiProcrastinationList.getDueDate()).isEqualTo(UPDATED_DUE_DATE);
    }

    @Test
    @Transactional
    void putNonExistingAntiProcrastinationList() throws Exception {
        int databaseSizeBeforeUpdate = antiProcrastinationListRepository.findAll().size();
        antiProcrastinationList.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAntiProcrastinationListMockMvc
            .perform(
                put(ENTITY_API_URL_ID, antiProcrastinationList.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(antiProcrastinationList))
            )
            .andExpect(status().isBadRequest());

        // Validate the AntiProcrastinationList in the database
        List<AntiProcrastinationList> antiProcrastinationListList = antiProcrastinationListRepository.findAll();
        assertThat(antiProcrastinationListList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAntiProcrastinationList() throws Exception {
        int databaseSizeBeforeUpdate = antiProcrastinationListRepository.findAll().size();
        antiProcrastinationList.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAntiProcrastinationListMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(antiProcrastinationList))
            )
            .andExpect(status().isBadRequest());

        // Validate the AntiProcrastinationList in the database
        List<AntiProcrastinationList> antiProcrastinationListList = antiProcrastinationListRepository.findAll();
        assertThat(antiProcrastinationListList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAntiProcrastinationList() throws Exception {
        int databaseSizeBeforeUpdate = antiProcrastinationListRepository.findAll().size();
        antiProcrastinationList.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAntiProcrastinationListMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(antiProcrastinationList))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the AntiProcrastinationList in the database
        List<AntiProcrastinationList> antiProcrastinationListList = antiProcrastinationListRepository.findAll();
        assertThat(antiProcrastinationListList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAntiProcrastinationListWithPatch() throws Exception {
        // Initialize the database
        antiProcrastinationListRepository.saveAndFlush(antiProcrastinationList);

        int databaseSizeBeforeUpdate = antiProcrastinationListRepository.findAll().size();

        // Update the antiProcrastinationList using partial update
        AntiProcrastinationList partialUpdatedAntiProcrastinationList = new AntiProcrastinationList();
        partialUpdatedAntiProcrastinationList.setId(antiProcrastinationList.getId());

        partialUpdatedAntiProcrastinationList.minutes(UPDATED_MINUTES).dueDate(UPDATED_DUE_DATE);

        restAntiProcrastinationListMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAntiProcrastinationList.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAntiProcrastinationList))
            )
            .andExpect(status().isOk());

        // Validate the AntiProcrastinationList in the database
        List<AntiProcrastinationList> antiProcrastinationListList = antiProcrastinationListRepository.findAll();
        assertThat(antiProcrastinationListList).hasSize(databaseSizeBeforeUpdate);
        AntiProcrastinationList testAntiProcrastinationList = antiProcrastinationListList.get(antiProcrastinationListList.size() - 1);
        assertThat(testAntiProcrastinationList.getLink()).isEqualTo(DEFAULT_LINK);
        assertThat(testAntiProcrastinationList.getType()).isEqualTo(DEFAULT_TYPE);
        assertThat(testAntiProcrastinationList.getDays()).isEqualTo(DEFAULT_DAYS);
        assertThat(testAntiProcrastinationList.getHours()).isEqualTo(DEFAULT_HOURS);
        assertThat(testAntiProcrastinationList.getMinutes()).isEqualTo(UPDATED_MINUTES);
        assertThat(testAntiProcrastinationList.getSeconds()).isEqualTo(DEFAULT_SECONDS);
        assertThat(testAntiProcrastinationList.getEmpty()).isEqualTo(DEFAULT_EMPTY);
        assertThat(testAntiProcrastinationList.getIdk()).isEqualTo(DEFAULT_IDK);
        assertThat(testAntiProcrastinationList.getIdk1()).isEqualTo(DEFAULT_IDK_1);
        assertThat(testAntiProcrastinationList.getDueDate()).isEqualTo(UPDATED_DUE_DATE);
    }

    @Test
    @Transactional
    void fullUpdateAntiProcrastinationListWithPatch() throws Exception {
        // Initialize the database
        antiProcrastinationListRepository.saveAndFlush(antiProcrastinationList);

        int databaseSizeBeforeUpdate = antiProcrastinationListRepository.findAll().size();

        // Update the antiProcrastinationList using partial update
        AntiProcrastinationList partialUpdatedAntiProcrastinationList = new AntiProcrastinationList();
        partialUpdatedAntiProcrastinationList.setId(antiProcrastinationList.getId());

        partialUpdatedAntiProcrastinationList
            .link(UPDATED_LINK)
            .type(UPDATED_TYPE)
            .days(UPDATED_DAYS)
            .hours(UPDATED_HOURS)
            .minutes(UPDATED_MINUTES)
            .seconds(UPDATED_SECONDS)
            .empty(UPDATED_EMPTY)
            .idk(UPDATED_IDK)
            .idk1(UPDATED_IDK_1)
            .dueDate(UPDATED_DUE_DATE);

        restAntiProcrastinationListMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAntiProcrastinationList.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAntiProcrastinationList))
            )
            .andExpect(status().isOk());

        // Validate the AntiProcrastinationList in the database
        List<AntiProcrastinationList> antiProcrastinationListList = antiProcrastinationListRepository.findAll();
        assertThat(antiProcrastinationListList).hasSize(databaseSizeBeforeUpdate);
        AntiProcrastinationList testAntiProcrastinationList = antiProcrastinationListList.get(antiProcrastinationListList.size() - 1);
        assertThat(testAntiProcrastinationList.getLink()).isEqualTo(UPDATED_LINK);
        assertThat(testAntiProcrastinationList.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testAntiProcrastinationList.getDays()).isEqualTo(UPDATED_DAYS);
        assertThat(testAntiProcrastinationList.getHours()).isEqualTo(UPDATED_HOURS);
        assertThat(testAntiProcrastinationList.getMinutes()).isEqualTo(UPDATED_MINUTES);
        assertThat(testAntiProcrastinationList.getSeconds()).isEqualTo(UPDATED_SECONDS);
        assertThat(testAntiProcrastinationList.getEmpty()).isEqualTo(UPDATED_EMPTY);
        assertThat(testAntiProcrastinationList.getIdk()).isEqualTo(UPDATED_IDK);
        assertThat(testAntiProcrastinationList.getIdk1()).isEqualTo(UPDATED_IDK_1);
        assertThat(testAntiProcrastinationList.getDueDate()).isEqualTo(UPDATED_DUE_DATE);
    }

    @Test
    @Transactional
    void patchNonExistingAntiProcrastinationList() throws Exception {
        int databaseSizeBeforeUpdate = antiProcrastinationListRepository.findAll().size();
        antiProcrastinationList.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAntiProcrastinationListMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, antiProcrastinationList.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(antiProcrastinationList))
            )
            .andExpect(status().isBadRequest());

        // Validate the AntiProcrastinationList in the database
        List<AntiProcrastinationList> antiProcrastinationListList = antiProcrastinationListRepository.findAll();
        assertThat(antiProcrastinationListList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAntiProcrastinationList() throws Exception {
        int databaseSizeBeforeUpdate = antiProcrastinationListRepository.findAll().size();
        antiProcrastinationList.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAntiProcrastinationListMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(antiProcrastinationList))
            )
            .andExpect(status().isBadRequest());

        // Validate the AntiProcrastinationList in the database
        List<AntiProcrastinationList> antiProcrastinationListList = antiProcrastinationListRepository.findAll();
        assertThat(antiProcrastinationListList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAntiProcrastinationList() throws Exception {
        int databaseSizeBeforeUpdate = antiProcrastinationListRepository.findAll().size();
        antiProcrastinationList.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAntiProcrastinationListMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(antiProcrastinationList))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the AntiProcrastinationList in the database
        List<AntiProcrastinationList> antiProcrastinationListList = antiProcrastinationListRepository.findAll();
        assertThat(antiProcrastinationListList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAntiProcrastinationList() throws Exception {
        // Initialize the database
        antiProcrastinationListRepository.saveAndFlush(antiProcrastinationList);

        int databaseSizeBeforeDelete = antiProcrastinationListRepository.findAll().size();

        // Delete the antiProcrastinationList
        restAntiProcrastinationListMockMvc
            .perform(delete(ENTITY_API_URL_ID, antiProcrastinationList.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<AntiProcrastinationList> antiProcrastinationListList = antiProcrastinationListRepository.findAll();
        assertThat(antiProcrastinationListList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
