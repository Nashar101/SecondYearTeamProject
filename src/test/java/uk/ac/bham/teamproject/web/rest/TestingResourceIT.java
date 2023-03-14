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
import uk.ac.bham.teamproject.domain.Testing;
import uk.ac.bham.teamproject.repository.TestingRepository;

/**
 * Integration tests for the {@link TestingResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class TestingResourceIT {

    private static final String DEFAULT_SUWI = "AAAAAAAAAA";
    private static final String UPDATED_SUWI = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/testings";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private TestingRepository testingRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restTestingMockMvc;

    private Testing testing;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Testing createEntity(EntityManager em) {
        Testing testing = new Testing().suwi(DEFAULT_SUWI);
        return testing;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Testing createUpdatedEntity(EntityManager em) {
        Testing testing = new Testing().suwi(UPDATED_SUWI);
        return testing;
    }

    @BeforeEach
    public void initTest() {
        testing = createEntity(em);
    }

    @Test
    @Transactional
    void createTesting() throws Exception {
        int databaseSizeBeforeCreate = testingRepository.findAll().size();
        // Create the Testing
        restTestingMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(testing)))
            .andExpect(status().isCreated());

        // Validate the Testing in the database
        List<Testing> testingList = testingRepository.findAll();
        assertThat(testingList).hasSize(databaseSizeBeforeCreate + 1);
        Testing testTesting = testingList.get(testingList.size() - 1);
        assertThat(testTesting.getSuwi()).isEqualTo(DEFAULT_SUWI);
    }

    @Test
    @Transactional
    void createTestingWithExistingId() throws Exception {
        // Create the Testing with an existing ID
        testing.setId(1L);

        int databaseSizeBeforeCreate = testingRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restTestingMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(testing)))
            .andExpect(status().isBadRequest());

        // Validate the Testing in the database
        List<Testing> testingList = testingRepository.findAll();
        assertThat(testingList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkSuwiIsRequired() throws Exception {
        int databaseSizeBeforeTest = testingRepository.findAll().size();
        // set the field null
        testing.setSuwi(null);

        // Create the Testing, which fails.

        restTestingMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(testing)))
            .andExpect(status().isBadRequest());

        List<Testing> testingList = testingRepository.findAll();
        assertThat(testingList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllTestings() throws Exception {
        // Initialize the database
        testingRepository.saveAndFlush(testing);

        // Get all the testingList
        restTestingMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(testing.getId().intValue())))
            .andExpect(jsonPath("$.[*].suwi").value(hasItem(DEFAULT_SUWI)));
    }

    @Test
    @Transactional
    void getTesting() throws Exception {
        // Initialize the database
        testingRepository.saveAndFlush(testing);

        // Get the testing
        restTestingMockMvc
            .perform(get(ENTITY_API_URL_ID, testing.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(testing.getId().intValue()))
            .andExpect(jsonPath("$.suwi").value(DEFAULT_SUWI));
    }

    @Test
    @Transactional
    void getNonExistingTesting() throws Exception {
        // Get the testing
        restTestingMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingTesting() throws Exception {
        // Initialize the database
        testingRepository.saveAndFlush(testing);

        int databaseSizeBeforeUpdate = testingRepository.findAll().size();

        // Update the testing
        Testing updatedTesting = testingRepository.findById(testing.getId()).get();
        // Disconnect from session so that the updates on updatedTesting are not directly saved in db
        em.detach(updatedTesting);
        updatedTesting.suwi(UPDATED_SUWI);

        restTestingMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedTesting.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedTesting))
            )
            .andExpect(status().isOk());

        // Validate the Testing in the database
        List<Testing> testingList = testingRepository.findAll();
        assertThat(testingList).hasSize(databaseSizeBeforeUpdate);
        Testing testTesting = testingList.get(testingList.size() - 1);
        assertThat(testTesting.getSuwi()).isEqualTo(UPDATED_SUWI);
    }

    @Test
    @Transactional
    void putNonExistingTesting() throws Exception {
        int databaseSizeBeforeUpdate = testingRepository.findAll().size();
        testing.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTestingMockMvc
            .perform(
                put(ENTITY_API_URL_ID, testing.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(testing))
            )
            .andExpect(status().isBadRequest());

        // Validate the Testing in the database
        List<Testing> testingList = testingRepository.findAll();
        assertThat(testingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchTesting() throws Exception {
        int databaseSizeBeforeUpdate = testingRepository.findAll().size();
        testing.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTestingMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(testing))
            )
            .andExpect(status().isBadRequest());

        // Validate the Testing in the database
        List<Testing> testingList = testingRepository.findAll();
        assertThat(testingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamTesting() throws Exception {
        int databaseSizeBeforeUpdate = testingRepository.findAll().size();
        testing.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTestingMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(testing)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Testing in the database
        List<Testing> testingList = testingRepository.findAll();
        assertThat(testingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateTestingWithPatch() throws Exception {
        // Initialize the database
        testingRepository.saveAndFlush(testing);

        int databaseSizeBeforeUpdate = testingRepository.findAll().size();

        // Update the testing using partial update
        Testing partialUpdatedTesting = new Testing();
        partialUpdatedTesting.setId(testing.getId());

        restTestingMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTesting.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTesting))
            )
            .andExpect(status().isOk());

        // Validate the Testing in the database
        List<Testing> testingList = testingRepository.findAll();
        assertThat(testingList).hasSize(databaseSizeBeforeUpdate);
        Testing testTesting = testingList.get(testingList.size() - 1);
        assertThat(testTesting.getSuwi()).isEqualTo(DEFAULT_SUWI);
    }

    @Test
    @Transactional
    void fullUpdateTestingWithPatch() throws Exception {
        // Initialize the database
        testingRepository.saveAndFlush(testing);

        int databaseSizeBeforeUpdate = testingRepository.findAll().size();

        // Update the testing using partial update
        Testing partialUpdatedTesting = new Testing();
        partialUpdatedTesting.setId(testing.getId());

        partialUpdatedTesting.suwi(UPDATED_SUWI);

        restTestingMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTesting.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTesting))
            )
            .andExpect(status().isOk());

        // Validate the Testing in the database
        List<Testing> testingList = testingRepository.findAll();
        assertThat(testingList).hasSize(databaseSizeBeforeUpdate);
        Testing testTesting = testingList.get(testingList.size() - 1);
        assertThat(testTesting.getSuwi()).isEqualTo(UPDATED_SUWI);
    }

    @Test
    @Transactional
    void patchNonExistingTesting() throws Exception {
        int databaseSizeBeforeUpdate = testingRepository.findAll().size();
        testing.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTestingMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, testing.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(testing))
            )
            .andExpect(status().isBadRequest());

        // Validate the Testing in the database
        List<Testing> testingList = testingRepository.findAll();
        assertThat(testingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchTesting() throws Exception {
        int databaseSizeBeforeUpdate = testingRepository.findAll().size();
        testing.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTestingMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(testing))
            )
            .andExpect(status().isBadRequest());

        // Validate the Testing in the database
        List<Testing> testingList = testingRepository.findAll();
        assertThat(testingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamTesting() throws Exception {
        int databaseSizeBeforeUpdate = testingRepository.findAll().size();
        testing.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTestingMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(testing)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Testing in the database
        List<Testing> testingList = testingRepository.findAll();
        assertThat(testingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteTesting() throws Exception {
        // Initialize the database
        testingRepository.saveAndFlush(testing);

        int databaseSizeBeforeDelete = testingRepository.findAll().size();

        // Delete the testing
        restTestingMockMvc
            .perform(delete(ENTITY_API_URL_ID, testing.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Testing> testingList = testingRepository.findAll();
        assertThat(testingList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
