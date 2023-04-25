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
import uk.ac.bham.teamproject.domain.ExtensionID;
import uk.ac.bham.teamproject.repository.ExtensionIDRepository;

/**
 * Integration tests for the {@link ExtensionIDResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class ExtensionIDResourceIT {

    private static final String DEFAULT_EXTENSION_ID = "AAAAAAAAAA";
    private static final String UPDATED_EXTENSION_ID = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/extension-ids";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ExtensionIDRepository extensionIDRepository;

    @Mock
    private ExtensionIDRepository extensionIDRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restExtensionIDMockMvc;

    private ExtensionID extensionID;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ExtensionID createEntity(EntityManager em) {
        ExtensionID extensionID = new ExtensionID().extensionID(DEFAULT_EXTENSION_ID);
        return extensionID;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ExtensionID createUpdatedEntity(EntityManager em) {
        ExtensionID extensionID = new ExtensionID().extensionID(UPDATED_EXTENSION_ID);
        return extensionID;
    }

    @BeforeEach
    public void initTest() {
        extensionID = createEntity(em);
    }

    @Test
    @Transactional
    void createExtensionID() throws Exception {
        int databaseSizeBeforeCreate = extensionIDRepository.findAll().size();
        // Create the ExtensionID
        restExtensionIDMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(extensionID)))
            .andExpect(status().isCreated());

        // Validate the ExtensionID in the database
        List<ExtensionID> extensionIDList = extensionIDRepository.findAll();
        assertThat(extensionIDList).hasSize(databaseSizeBeforeCreate + 1);
        ExtensionID testExtensionID = extensionIDList.get(extensionIDList.size() - 1);
        assertThat(testExtensionID.getExtensionID()).isEqualTo(DEFAULT_EXTENSION_ID);
    }

    @Test
    @Transactional
    void createExtensionIDWithExistingId() throws Exception {
        // Create the ExtensionID with an existing ID
        extensionID.setId(1L);

        int databaseSizeBeforeCreate = extensionIDRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restExtensionIDMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(extensionID)))
            .andExpect(status().isBadRequest());

        // Validate the ExtensionID in the database
        List<ExtensionID> extensionIDList = extensionIDRepository.findAll();
        assertThat(extensionIDList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllExtensionIDS() throws Exception {
        // Initialize the database
        extensionIDRepository.saveAndFlush(extensionID);

        // Get all the extensionIDList
        restExtensionIDMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(extensionID.getId().intValue())))
            .andExpect(jsonPath("$.[*].extensionID").value(hasItem(DEFAULT_EXTENSION_ID)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllExtensionIDSWithEagerRelationshipsIsEnabled() throws Exception {
        when(extensionIDRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restExtensionIDMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(extensionIDRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllExtensionIDSWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(extensionIDRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restExtensionIDMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(extensionIDRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getExtensionID() throws Exception {
        // Initialize the database
        extensionIDRepository.saveAndFlush(extensionID);

        // Get the extensionID
        restExtensionIDMockMvc
            .perform(get(ENTITY_API_URL_ID, extensionID.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(extensionID.getId().intValue()))
            .andExpect(jsonPath("$.extensionID").value(DEFAULT_EXTENSION_ID));
    }

    @Test
    @Transactional
    void getNonExistingExtensionID() throws Exception {
        // Get the extensionID
        restExtensionIDMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingExtensionID() throws Exception {
        // Initialize the database
        extensionIDRepository.saveAndFlush(extensionID);

        int databaseSizeBeforeUpdate = extensionIDRepository.findAll().size();

        // Update the extensionID
        ExtensionID updatedExtensionID = extensionIDRepository.findById(extensionID.getId()).get();
        // Disconnect from session so that the updates on updatedExtensionID are not directly saved in db
        em.detach(updatedExtensionID);
        updatedExtensionID.extensionID(UPDATED_EXTENSION_ID);

        restExtensionIDMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedExtensionID.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedExtensionID))
            )
            .andExpect(status().isOk());

        // Validate the ExtensionID in the database
        List<ExtensionID> extensionIDList = extensionIDRepository.findAll();
        assertThat(extensionIDList).hasSize(databaseSizeBeforeUpdate);
        ExtensionID testExtensionID = extensionIDList.get(extensionIDList.size() - 1);
        assertThat(testExtensionID.getExtensionID()).isEqualTo(UPDATED_EXTENSION_ID);
    }

    @Test
    @Transactional
    void putNonExistingExtensionID() throws Exception {
        int databaseSizeBeforeUpdate = extensionIDRepository.findAll().size();
        extensionID.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restExtensionIDMockMvc
            .perform(
                put(ENTITY_API_URL_ID, extensionID.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(extensionID))
            )
            .andExpect(status().isBadRequest());

        // Validate the ExtensionID in the database
        List<ExtensionID> extensionIDList = extensionIDRepository.findAll();
        assertThat(extensionIDList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchExtensionID() throws Exception {
        int databaseSizeBeforeUpdate = extensionIDRepository.findAll().size();
        extensionID.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restExtensionIDMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(extensionID))
            )
            .andExpect(status().isBadRequest());

        // Validate the ExtensionID in the database
        List<ExtensionID> extensionIDList = extensionIDRepository.findAll();
        assertThat(extensionIDList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamExtensionID() throws Exception {
        int databaseSizeBeforeUpdate = extensionIDRepository.findAll().size();
        extensionID.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restExtensionIDMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(extensionID)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the ExtensionID in the database
        List<ExtensionID> extensionIDList = extensionIDRepository.findAll();
        assertThat(extensionIDList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateExtensionIDWithPatch() throws Exception {
        // Initialize the database
        extensionIDRepository.saveAndFlush(extensionID);

        int databaseSizeBeforeUpdate = extensionIDRepository.findAll().size();

        // Update the extensionID using partial update
        ExtensionID partialUpdatedExtensionID = new ExtensionID();
        partialUpdatedExtensionID.setId(extensionID.getId());

        partialUpdatedExtensionID.extensionID(UPDATED_EXTENSION_ID);

        restExtensionIDMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedExtensionID.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedExtensionID))
            )
            .andExpect(status().isOk());

        // Validate the ExtensionID in the database
        List<ExtensionID> extensionIDList = extensionIDRepository.findAll();
        assertThat(extensionIDList).hasSize(databaseSizeBeforeUpdate);
        ExtensionID testExtensionID = extensionIDList.get(extensionIDList.size() - 1);
        assertThat(testExtensionID.getExtensionID()).isEqualTo(UPDATED_EXTENSION_ID);
    }

    @Test
    @Transactional
    void fullUpdateExtensionIDWithPatch() throws Exception {
        // Initialize the database
        extensionIDRepository.saveAndFlush(extensionID);

        int databaseSizeBeforeUpdate = extensionIDRepository.findAll().size();

        // Update the extensionID using partial update
        ExtensionID partialUpdatedExtensionID = new ExtensionID();
        partialUpdatedExtensionID.setId(extensionID.getId());

        partialUpdatedExtensionID.extensionID(UPDATED_EXTENSION_ID);

        restExtensionIDMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedExtensionID.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedExtensionID))
            )
            .andExpect(status().isOk());

        // Validate the ExtensionID in the database
        List<ExtensionID> extensionIDList = extensionIDRepository.findAll();
        assertThat(extensionIDList).hasSize(databaseSizeBeforeUpdate);
        ExtensionID testExtensionID = extensionIDList.get(extensionIDList.size() - 1);
        assertThat(testExtensionID.getExtensionID()).isEqualTo(UPDATED_EXTENSION_ID);
    }

    @Test
    @Transactional
    void patchNonExistingExtensionID() throws Exception {
        int databaseSizeBeforeUpdate = extensionIDRepository.findAll().size();
        extensionID.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restExtensionIDMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, extensionID.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(extensionID))
            )
            .andExpect(status().isBadRequest());

        // Validate the ExtensionID in the database
        List<ExtensionID> extensionIDList = extensionIDRepository.findAll();
        assertThat(extensionIDList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchExtensionID() throws Exception {
        int databaseSizeBeforeUpdate = extensionIDRepository.findAll().size();
        extensionID.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restExtensionIDMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(extensionID))
            )
            .andExpect(status().isBadRequest());

        // Validate the ExtensionID in the database
        List<ExtensionID> extensionIDList = extensionIDRepository.findAll();
        assertThat(extensionIDList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamExtensionID() throws Exception {
        int databaseSizeBeforeUpdate = extensionIDRepository.findAll().size();
        extensionID.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restExtensionIDMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(extensionID))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ExtensionID in the database
        List<ExtensionID> extensionIDList = extensionIDRepository.findAll();
        assertThat(extensionIDList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteExtensionID() throws Exception {
        // Initialize the database
        extensionIDRepository.saveAndFlush(extensionID);

        int databaseSizeBeforeDelete = extensionIDRepository.findAll().size();

        // Delete the extensionID
        restExtensionIDMockMvc
            .perform(delete(ENTITY_API_URL_ID, extensionID.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ExtensionID> extensionIDList = extensionIDRepository.findAll();
        assertThat(extensionIDList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
