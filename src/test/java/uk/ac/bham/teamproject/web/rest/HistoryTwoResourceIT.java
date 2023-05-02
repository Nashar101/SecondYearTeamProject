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
import uk.ac.bham.teamproject.domain.HistoryTwo;
import uk.ac.bham.teamproject.repository.HistoryTwoRepository;

/**
 * Integration tests for the {@link HistoryTwoResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class HistoryTwoResourceIT {

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

    private static final String ENTITY_API_URL = "/api/history-twos";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private HistoryTwoRepository historyTwoRepository;

    @Mock
    private HistoryTwoRepository historyTwoRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restHistoryTwoMockMvc;

    private HistoryTwo historyTwo;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static HistoryTwo createEntity(EntityManager em) {
        HistoryTwo historyTwo = new HistoryTwo()
            .subject(DEFAULT_SUBJECT)
            .subjectScore(DEFAULT_SUBJECT_SCORE)
            .subjectTarget(DEFAULT_SUBJECT_TARGET)
            .upcomingTest(DEFAULT_UPCOMING_TEST)
            .upcomingTestTarget(DEFAULT_UPCOMING_TEST_TARGET);
        return historyTwo;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static HistoryTwo createUpdatedEntity(EntityManager em) {
        HistoryTwo historyTwo = new HistoryTwo()
            .subject(UPDATED_SUBJECT)
            .subjectScore(UPDATED_SUBJECT_SCORE)
            .subjectTarget(UPDATED_SUBJECT_TARGET)
            .upcomingTest(UPDATED_UPCOMING_TEST)
            .upcomingTestTarget(UPDATED_UPCOMING_TEST_TARGET);
        return historyTwo;
    }

    @BeforeEach
    public void initTest() {
        historyTwo = createEntity(em);
    }

    @Test
    @Transactional
    void createHistoryTwo() throws Exception {
        int databaseSizeBeforeCreate = historyTwoRepository.findAll().size();
        // Create the HistoryTwo
        restHistoryTwoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(historyTwo)))
            .andExpect(status().isCreated());

        // Validate the HistoryTwo in the database
        List<HistoryTwo> historyTwoList = historyTwoRepository.findAll();
        assertThat(historyTwoList).hasSize(databaseSizeBeforeCreate + 1);
        HistoryTwo testHistoryTwo = historyTwoList.get(historyTwoList.size() - 1);
        assertThat(testHistoryTwo.getSubject()).isEqualTo(DEFAULT_SUBJECT);
        assertThat(testHistoryTwo.getSubjectScore()).isEqualTo(DEFAULT_SUBJECT_SCORE);
        assertThat(testHistoryTwo.getSubjectTarget()).isEqualTo(DEFAULT_SUBJECT_TARGET);
        assertThat(testHistoryTwo.getUpcomingTest()).isEqualTo(DEFAULT_UPCOMING_TEST);
        assertThat(testHistoryTwo.getUpcomingTestTarget()).isEqualTo(DEFAULT_UPCOMING_TEST_TARGET);
    }

    @Test
    @Transactional
    void createHistoryTwoWithExistingId() throws Exception {
        // Create the HistoryTwo with an existing ID
        historyTwo.setId(1L);

        int databaseSizeBeforeCreate = historyTwoRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restHistoryTwoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(historyTwo)))
            .andExpect(status().isBadRequest());

        // Validate the HistoryTwo in the database
        List<HistoryTwo> historyTwoList = historyTwoRepository.findAll();
        assertThat(historyTwoList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllHistoryTwos() throws Exception {
        // Initialize the database
        historyTwoRepository.saveAndFlush(historyTwo);

        // Get all the historyTwoList
        restHistoryTwoMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(historyTwo.getId().intValue())))
            .andExpect(jsonPath("$.[*].subject").value(hasItem(DEFAULT_SUBJECT)))
            .andExpect(jsonPath("$.[*].subjectScore").value(hasItem(DEFAULT_SUBJECT_SCORE)))
            .andExpect(jsonPath("$.[*].subjectTarget").value(hasItem(DEFAULT_SUBJECT_TARGET)))
            .andExpect(jsonPath("$.[*].upcomingTest").value(hasItem(DEFAULT_UPCOMING_TEST)))
            .andExpect(jsonPath("$.[*].upcomingTestTarget").value(hasItem(DEFAULT_UPCOMING_TEST_TARGET)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllHistoryTwosWithEagerRelationshipsIsEnabled() throws Exception {
        when(historyTwoRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restHistoryTwoMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(historyTwoRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllHistoryTwosWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(historyTwoRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restHistoryTwoMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(historyTwoRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getHistoryTwo() throws Exception {
        // Initialize the database
        historyTwoRepository.saveAndFlush(historyTwo);

        // Get the historyTwo
        restHistoryTwoMockMvc
            .perform(get(ENTITY_API_URL_ID, historyTwo.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(historyTwo.getId().intValue()))
            .andExpect(jsonPath("$.subject").value(DEFAULT_SUBJECT))
            .andExpect(jsonPath("$.subjectScore").value(DEFAULT_SUBJECT_SCORE))
            .andExpect(jsonPath("$.subjectTarget").value(DEFAULT_SUBJECT_TARGET))
            .andExpect(jsonPath("$.upcomingTest").value(DEFAULT_UPCOMING_TEST))
            .andExpect(jsonPath("$.upcomingTestTarget").value(DEFAULT_UPCOMING_TEST_TARGET));
    }

    @Test
    @Transactional
    void getNonExistingHistoryTwo() throws Exception {
        // Get the historyTwo
        restHistoryTwoMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingHistoryTwo() throws Exception {
        // Initialize the database
        historyTwoRepository.saveAndFlush(historyTwo);

        int databaseSizeBeforeUpdate = historyTwoRepository.findAll().size();

        // Update the historyTwo
        HistoryTwo updatedHistoryTwo = historyTwoRepository.findById(historyTwo.getId()).get();
        // Disconnect from session so that the updates on updatedHistoryTwo are not directly saved in db
        em.detach(updatedHistoryTwo);
        updatedHistoryTwo
            .subject(UPDATED_SUBJECT)
            .subjectScore(UPDATED_SUBJECT_SCORE)
            .subjectTarget(UPDATED_SUBJECT_TARGET)
            .upcomingTest(UPDATED_UPCOMING_TEST)
            .upcomingTestTarget(UPDATED_UPCOMING_TEST_TARGET);

        restHistoryTwoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedHistoryTwo.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedHistoryTwo))
            )
            .andExpect(status().isOk());

        // Validate the HistoryTwo in the database
        List<HistoryTwo> historyTwoList = historyTwoRepository.findAll();
        assertThat(historyTwoList).hasSize(databaseSizeBeforeUpdate);
        HistoryTwo testHistoryTwo = historyTwoList.get(historyTwoList.size() - 1);
        assertThat(testHistoryTwo.getSubject()).isEqualTo(UPDATED_SUBJECT);
        assertThat(testHistoryTwo.getSubjectScore()).isEqualTo(UPDATED_SUBJECT_SCORE);
        assertThat(testHistoryTwo.getSubjectTarget()).isEqualTo(UPDATED_SUBJECT_TARGET);
        assertThat(testHistoryTwo.getUpcomingTest()).isEqualTo(UPDATED_UPCOMING_TEST);
        assertThat(testHistoryTwo.getUpcomingTestTarget()).isEqualTo(UPDATED_UPCOMING_TEST_TARGET);
    }

    @Test
    @Transactional
    void putNonExistingHistoryTwo() throws Exception {
        int databaseSizeBeforeUpdate = historyTwoRepository.findAll().size();
        historyTwo.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restHistoryTwoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, historyTwo.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(historyTwo))
            )
            .andExpect(status().isBadRequest());

        // Validate the HistoryTwo in the database
        List<HistoryTwo> historyTwoList = historyTwoRepository.findAll();
        assertThat(historyTwoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchHistoryTwo() throws Exception {
        int databaseSizeBeforeUpdate = historyTwoRepository.findAll().size();
        historyTwo.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restHistoryTwoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(historyTwo))
            )
            .andExpect(status().isBadRequest());

        // Validate the HistoryTwo in the database
        List<HistoryTwo> historyTwoList = historyTwoRepository.findAll();
        assertThat(historyTwoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamHistoryTwo() throws Exception {
        int databaseSizeBeforeUpdate = historyTwoRepository.findAll().size();
        historyTwo.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restHistoryTwoMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(historyTwo)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the HistoryTwo in the database
        List<HistoryTwo> historyTwoList = historyTwoRepository.findAll();
        assertThat(historyTwoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateHistoryTwoWithPatch() throws Exception {
        // Initialize the database
        historyTwoRepository.saveAndFlush(historyTwo);

        int databaseSizeBeforeUpdate = historyTwoRepository.findAll().size();

        // Update the historyTwo using partial update
        HistoryTwo partialUpdatedHistoryTwo = new HistoryTwo();
        partialUpdatedHistoryTwo.setId(historyTwo.getId());

        partialUpdatedHistoryTwo.upcomingTest(UPDATED_UPCOMING_TEST).upcomingTestTarget(UPDATED_UPCOMING_TEST_TARGET);

        restHistoryTwoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedHistoryTwo.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedHistoryTwo))
            )
            .andExpect(status().isOk());

        // Validate the HistoryTwo in the database
        List<HistoryTwo> historyTwoList = historyTwoRepository.findAll();
        assertThat(historyTwoList).hasSize(databaseSizeBeforeUpdate);
        HistoryTwo testHistoryTwo = historyTwoList.get(historyTwoList.size() - 1);
        assertThat(testHistoryTwo.getSubject()).isEqualTo(DEFAULT_SUBJECT);
        assertThat(testHistoryTwo.getSubjectScore()).isEqualTo(DEFAULT_SUBJECT_SCORE);
        assertThat(testHistoryTwo.getSubjectTarget()).isEqualTo(DEFAULT_SUBJECT_TARGET);
        assertThat(testHistoryTwo.getUpcomingTest()).isEqualTo(UPDATED_UPCOMING_TEST);
        assertThat(testHistoryTwo.getUpcomingTestTarget()).isEqualTo(UPDATED_UPCOMING_TEST_TARGET);
    }

    @Test
    @Transactional
    void fullUpdateHistoryTwoWithPatch() throws Exception {
        // Initialize the database
        historyTwoRepository.saveAndFlush(historyTwo);

        int databaseSizeBeforeUpdate = historyTwoRepository.findAll().size();

        // Update the historyTwo using partial update
        HistoryTwo partialUpdatedHistoryTwo = new HistoryTwo();
        partialUpdatedHistoryTwo.setId(historyTwo.getId());

        partialUpdatedHistoryTwo
            .subject(UPDATED_SUBJECT)
            .subjectScore(UPDATED_SUBJECT_SCORE)
            .subjectTarget(UPDATED_SUBJECT_TARGET)
            .upcomingTest(UPDATED_UPCOMING_TEST)
            .upcomingTestTarget(UPDATED_UPCOMING_TEST_TARGET);

        restHistoryTwoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedHistoryTwo.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedHistoryTwo))
            )
            .andExpect(status().isOk());

        // Validate the HistoryTwo in the database
        List<HistoryTwo> historyTwoList = historyTwoRepository.findAll();
        assertThat(historyTwoList).hasSize(databaseSizeBeforeUpdate);
        HistoryTwo testHistoryTwo = historyTwoList.get(historyTwoList.size() - 1);
        assertThat(testHistoryTwo.getSubject()).isEqualTo(UPDATED_SUBJECT);
        assertThat(testHistoryTwo.getSubjectScore()).isEqualTo(UPDATED_SUBJECT_SCORE);
        assertThat(testHistoryTwo.getSubjectTarget()).isEqualTo(UPDATED_SUBJECT_TARGET);
        assertThat(testHistoryTwo.getUpcomingTest()).isEqualTo(UPDATED_UPCOMING_TEST);
        assertThat(testHistoryTwo.getUpcomingTestTarget()).isEqualTo(UPDATED_UPCOMING_TEST_TARGET);
    }

    @Test
    @Transactional
    void patchNonExistingHistoryTwo() throws Exception {
        int databaseSizeBeforeUpdate = historyTwoRepository.findAll().size();
        historyTwo.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restHistoryTwoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, historyTwo.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(historyTwo))
            )
            .andExpect(status().isBadRequest());

        // Validate the HistoryTwo in the database
        List<HistoryTwo> historyTwoList = historyTwoRepository.findAll();
        assertThat(historyTwoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchHistoryTwo() throws Exception {
        int databaseSizeBeforeUpdate = historyTwoRepository.findAll().size();
        historyTwo.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restHistoryTwoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(historyTwo))
            )
            .andExpect(status().isBadRequest());

        // Validate the HistoryTwo in the database
        List<HistoryTwo> historyTwoList = historyTwoRepository.findAll();
        assertThat(historyTwoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamHistoryTwo() throws Exception {
        int databaseSizeBeforeUpdate = historyTwoRepository.findAll().size();
        historyTwo.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restHistoryTwoMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(historyTwo))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the HistoryTwo in the database
        List<HistoryTwo> historyTwoList = historyTwoRepository.findAll();
        assertThat(historyTwoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteHistoryTwo() throws Exception {
        // Initialize the database
        historyTwoRepository.saveAndFlush(historyTwo);

        int databaseSizeBeforeDelete = historyTwoRepository.findAll().size();

        // Delete the historyTwo
        restHistoryTwoMockMvc
            .perform(delete(ENTITY_API_URL_ID, historyTwo.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<HistoryTwo> historyTwoList = historyTwoRepository.findAll();
        assertThat(historyTwoList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
