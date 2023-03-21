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
import uk.ac.bham.teamproject.domain.History;
import uk.ac.bham.teamproject.repository.HistoryRepository;

/**
 * Integration tests for the {@link HistoryResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class HistoryResourceIT {

    private static final String DEFAULT_SUBJECT = "AAAAAAAAAA";
    private static final String UPDATED_SUBJECT = "BBBBBBBBBB";

    private static final Integer DEFAULT_SUBJECT_SCORE = 1;
    private static final Integer UPDATED_SUBJECT_SCORE = 2;

    private static final Integer DEFAULT_SUBJECT_TARGET = 1;
    private static final Integer UPDATED_SUBJECT_TARGET = 2;

    private static final String DEFAULT_UPCOMING_TEST = "AAAAAAAAAA";
    private static final String UPDATED_UPCOMING_TEST = "BBBBBBBBBB";

    private static final Integer DEFAULT_UPCOMING_TEST_TARGET = 1;
    private static final Integer UPDATED_UPCOMING_TEST_TARGET = 2;

    private static final String ENTITY_API_URL = "/api/histories";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private HistoryRepository historyRepository;

    @Mock
    private HistoryRepository historyRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restHistoryMockMvc;

    private History history;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static History createEntity(EntityManager em) {
        History history = new History()
            .subject(DEFAULT_SUBJECT)
            .subjectScore(DEFAULT_SUBJECT_SCORE)
            .subjectTarget(DEFAULT_SUBJECT_TARGET)
            .upcomingTest(DEFAULT_UPCOMING_TEST)
            .upcomingTestTarget(DEFAULT_UPCOMING_TEST_TARGET);
        return history;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static History createUpdatedEntity(EntityManager em) {
        History history = new History()
            .subject(UPDATED_SUBJECT)
            .subjectScore(UPDATED_SUBJECT_SCORE)
            .subjectTarget(UPDATED_SUBJECT_TARGET)
            .upcomingTest(UPDATED_UPCOMING_TEST)
            .upcomingTestTarget(UPDATED_UPCOMING_TEST_TARGET);
        return history;
    }

    @BeforeEach
    public void initTest() {
        history = createEntity(em);
    }

    @Test
    @Transactional
    void createHistory() throws Exception {
        int databaseSizeBeforeCreate = historyRepository.findAll().size();
        // Create the History
        restHistoryMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(history)))
            .andExpect(status().isCreated());

        // Validate the History in the database
        List<History> historyList = historyRepository.findAll();
        assertThat(historyList).hasSize(databaseSizeBeforeCreate + 1);
        History testHistory = historyList.get(historyList.size() - 1);
        assertThat(testHistory.getSubject()).isEqualTo(DEFAULT_SUBJECT);
        assertThat(testHistory.getSubjectScore()).isEqualTo(DEFAULT_SUBJECT_SCORE);
        assertThat(testHistory.getSubjectTarget()).isEqualTo(DEFAULT_SUBJECT_TARGET);
        assertThat(testHistory.getUpcomingTest()).isEqualTo(DEFAULT_UPCOMING_TEST);
        assertThat(testHistory.getUpcomingTestTarget()).isEqualTo(DEFAULT_UPCOMING_TEST_TARGET);
    }

    @Test
    @Transactional
    void createHistoryWithExistingId() throws Exception {
        // Create the History with an existing ID
        history.setId(1L);

        int databaseSizeBeforeCreate = historyRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restHistoryMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(history)))
            .andExpect(status().isBadRequest());

        // Validate the History in the database
        List<History> historyList = historyRepository.findAll();
        assertThat(historyList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllHistories() throws Exception {
        // Initialize the database
        historyRepository.saveAndFlush(history);

        // Get all the historyList
        restHistoryMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(history.getId().intValue())))
            .andExpect(jsonPath("$.[*].subject").value(hasItem(DEFAULT_SUBJECT)))
            .andExpect(jsonPath("$.[*].subjectScore").value(hasItem(DEFAULT_SUBJECT_SCORE)))
            .andExpect(jsonPath("$.[*].subjectTarget").value(hasItem(DEFAULT_SUBJECT_TARGET)))
            .andExpect(jsonPath("$.[*].upcomingTest").value(hasItem(DEFAULT_UPCOMING_TEST)))
            .andExpect(jsonPath("$.[*].upcomingTestTarget").value(hasItem(DEFAULT_UPCOMING_TEST_TARGET)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllHistoriesWithEagerRelationshipsIsEnabled() throws Exception {
        when(historyRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restHistoryMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(historyRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllHistoriesWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(historyRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restHistoryMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(historyRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getHistory() throws Exception {
        // Initialize the database
        historyRepository.saveAndFlush(history);

        // Get the history
        restHistoryMockMvc
            .perform(get(ENTITY_API_URL_ID, history.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(history.getId().intValue()))
            .andExpect(jsonPath("$.subject").value(DEFAULT_SUBJECT))
            .andExpect(jsonPath("$.subjectScore").value(DEFAULT_SUBJECT_SCORE))
            .andExpect(jsonPath("$.subjectTarget").value(DEFAULT_SUBJECT_TARGET))
            .andExpect(jsonPath("$.upcomingTest").value(DEFAULT_UPCOMING_TEST))
            .andExpect(jsonPath("$.upcomingTestTarget").value(DEFAULT_UPCOMING_TEST_TARGET));
    }

    @Test
    @Transactional
    void getNonExistingHistory() throws Exception {
        // Get the history
        restHistoryMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingHistory() throws Exception {
        // Initialize the database
        historyRepository.saveAndFlush(history);

        int databaseSizeBeforeUpdate = historyRepository.findAll().size();

        // Update the history
        History updatedHistory = historyRepository.findById(history.getId()).get();
        // Disconnect from session so that the updates on updatedHistory are not directly saved in db
        em.detach(updatedHistory);
        updatedHistory
            .subject(UPDATED_SUBJECT)
            .subjectScore(UPDATED_SUBJECT_SCORE)
            .subjectTarget(UPDATED_SUBJECT_TARGET)
            .upcomingTest(UPDATED_UPCOMING_TEST)
            .upcomingTestTarget(UPDATED_UPCOMING_TEST_TARGET);

        restHistoryMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedHistory.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedHistory))
            )
            .andExpect(status().isOk());

        // Validate the History in the database
        List<History> historyList = historyRepository.findAll();
        assertThat(historyList).hasSize(databaseSizeBeforeUpdate);
        History testHistory = historyList.get(historyList.size() - 1);
        assertThat(testHistory.getSubject()).isEqualTo(UPDATED_SUBJECT);
        assertThat(testHistory.getSubjectScore()).isEqualTo(UPDATED_SUBJECT_SCORE);
        assertThat(testHistory.getSubjectTarget()).isEqualTo(UPDATED_SUBJECT_TARGET);
        assertThat(testHistory.getUpcomingTest()).isEqualTo(UPDATED_UPCOMING_TEST);
        assertThat(testHistory.getUpcomingTestTarget()).isEqualTo(UPDATED_UPCOMING_TEST_TARGET);
    }

    @Test
    @Transactional
    void putNonExistingHistory() throws Exception {
        int databaseSizeBeforeUpdate = historyRepository.findAll().size();
        history.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restHistoryMockMvc
            .perform(
                put(ENTITY_API_URL_ID, history.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(history))
            )
            .andExpect(status().isBadRequest());

        // Validate the History in the database
        List<History> historyList = historyRepository.findAll();
        assertThat(historyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchHistory() throws Exception {
        int databaseSizeBeforeUpdate = historyRepository.findAll().size();
        history.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restHistoryMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(history))
            )
            .andExpect(status().isBadRequest());

        // Validate the History in the database
        List<History> historyList = historyRepository.findAll();
        assertThat(historyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamHistory() throws Exception {
        int databaseSizeBeforeUpdate = historyRepository.findAll().size();
        history.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restHistoryMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(history)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the History in the database
        List<History> historyList = historyRepository.findAll();
        assertThat(historyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateHistoryWithPatch() throws Exception {
        // Initialize the database
        historyRepository.saveAndFlush(history);

        int databaseSizeBeforeUpdate = historyRepository.findAll().size();

        // Update the history using partial update
        History partialUpdatedHistory = new History();
        partialUpdatedHistory.setId(history.getId());

        partialUpdatedHistory.upcomingTest(UPDATED_UPCOMING_TEST).upcomingTestTarget(UPDATED_UPCOMING_TEST_TARGET);

        restHistoryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedHistory.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedHistory))
            )
            .andExpect(status().isOk());

        // Validate the History in the database
        List<History> historyList = historyRepository.findAll();
        assertThat(historyList).hasSize(databaseSizeBeforeUpdate);
        History testHistory = historyList.get(historyList.size() - 1);
        assertThat(testHistory.getSubject()).isEqualTo(DEFAULT_SUBJECT);
        assertThat(testHistory.getSubjectScore()).isEqualTo(DEFAULT_SUBJECT_SCORE);
        assertThat(testHistory.getSubjectTarget()).isEqualTo(DEFAULT_SUBJECT_TARGET);
        assertThat(testHistory.getUpcomingTest()).isEqualTo(UPDATED_UPCOMING_TEST);
        assertThat(testHistory.getUpcomingTestTarget()).isEqualTo(UPDATED_UPCOMING_TEST_TARGET);
    }

    @Test
    @Transactional
    void fullUpdateHistoryWithPatch() throws Exception {
        // Initialize the database
        historyRepository.saveAndFlush(history);

        int databaseSizeBeforeUpdate = historyRepository.findAll().size();

        // Update the history using partial update
        History partialUpdatedHistory = new History();
        partialUpdatedHistory.setId(history.getId());

        partialUpdatedHistory
            .subject(UPDATED_SUBJECT)
            .subjectScore(UPDATED_SUBJECT_SCORE)
            .subjectTarget(UPDATED_SUBJECT_TARGET)
            .upcomingTest(UPDATED_UPCOMING_TEST)
            .upcomingTestTarget(UPDATED_UPCOMING_TEST_TARGET);

        restHistoryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedHistory.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedHistory))
            )
            .andExpect(status().isOk());

        // Validate the History in the database
        List<History> historyList = historyRepository.findAll();
        assertThat(historyList).hasSize(databaseSizeBeforeUpdate);
        History testHistory = historyList.get(historyList.size() - 1);
        assertThat(testHistory.getSubject()).isEqualTo(UPDATED_SUBJECT);
        assertThat(testHistory.getSubjectScore()).isEqualTo(UPDATED_SUBJECT_SCORE);
        assertThat(testHistory.getSubjectTarget()).isEqualTo(UPDATED_SUBJECT_TARGET);
        assertThat(testHistory.getUpcomingTest()).isEqualTo(UPDATED_UPCOMING_TEST);
        assertThat(testHistory.getUpcomingTestTarget()).isEqualTo(UPDATED_UPCOMING_TEST_TARGET);
    }

    @Test
    @Transactional
    void patchNonExistingHistory() throws Exception {
        int databaseSizeBeforeUpdate = historyRepository.findAll().size();
        history.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restHistoryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, history.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(history))
            )
            .andExpect(status().isBadRequest());

        // Validate the History in the database
        List<History> historyList = historyRepository.findAll();
        assertThat(historyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchHistory() throws Exception {
        int databaseSizeBeforeUpdate = historyRepository.findAll().size();
        history.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restHistoryMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(history))
            )
            .andExpect(status().isBadRequest());

        // Validate the History in the database
        List<History> historyList = historyRepository.findAll();
        assertThat(historyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamHistory() throws Exception {
        int databaseSizeBeforeUpdate = historyRepository.findAll().size();
        history.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restHistoryMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(history)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the History in the database
        List<History> historyList = historyRepository.findAll();
        assertThat(historyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteHistory() throws Exception {
        // Initialize the database
        historyRepository.saveAndFlush(history);

        int databaseSizeBeforeDelete = historyRepository.findAll().size();

        // Delete the history
        restHistoryMockMvc
            .perform(delete(ENTITY_API_URL_ID, history.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<History> historyList = historyRepository.findAll();
        assertThat(historyList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
