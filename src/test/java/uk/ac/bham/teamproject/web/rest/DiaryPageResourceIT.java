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
import uk.ac.bham.teamproject.domain.DiaryPage;
import uk.ac.bham.teamproject.repository.DiaryPageRepository;

/**
 * Integration tests for the {@link DiaryPageResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class DiaryPageResourceIT {

    private static final ZonedDateTime DEFAULT_PAGE_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_PAGE_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String DEFAULT_PAGE_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_PAGE_DESCRIPTION = "BBBBBBBBBB";

    private static final Instant DEFAULT_CREATION_TIME = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_CREATION_TIME = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Instant DEFAULT_LAST_EDIT_TIME = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_LAST_EDIT_TIME = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/diary-pages";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private DiaryPageRepository diaryPageRepository;

    @Mock
    private DiaryPageRepository diaryPageRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restDiaryPageMockMvc;

    private DiaryPage diaryPage;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static DiaryPage createEntity(EntityManager em) {
        DiaryPage diaryPage = new DiaryPage()
            .pageDate(DEFAULT_PAGE_DATE)
            .pageDescription(DEFAULT_PAGE_DESCRIPTION)
            .creationTime(DEFAULT_CREATION_TIME)
            .lastEditTime(DEFAULT_LAST_EDIT_TIME);
        return diaryPage;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static DiaryPage createUpdatedEntity(EntityManager em) {
        DiaryPage diaryPage = new DiaryPage()
            .pageDate(UPDATED_PAGE_DATE)
            .pageDescription(UPDATED_PAGE_DESCRIPTION)
            .creationTime(UPDATED_CREATION_TIME)
            .lastEditTime(UPDATED_LAST_EDIT_TIME);
        return diaryPage;
    }

    @BeforeEach
    public void initTest() {
        diaryPage = createEntity(em);
    }

    @Test
    @Transactional
    void createDiaryPage() throws Exception {
        int databaseSizeBeforeCreate = diaryPageRepository.findAll().size();
        // Create the DiaryPage
        restDiaryPageMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(diaryPage)))
            .andExpect(status().isCreated());

        // Validate the DiaryPage in the database
        List<DiaryPage> diaryPageList = diaryPageRepository.findAll();
        assertThat(diaryPageList).hasSize(databaseSizeBeforeCreate + 1);
        DiaryPage testDiaryPage = diaryPageList.get(diaryPageList.size() - 1);
        assertThat(testDiaryPage.getPageDate()).isEqualTo(DEFAULT_PAGE_DATE);
        assertThat(testDiaryPage.getPageDescription()).isEqualTo(DEFAULT_PAGE_DESCRIPTION);
        assertThat(testDiaryPage.getCreationTime()).isEqualTo(DEFAULT_CREATION_TIME);
        assertThat(testDiaryPage.getLastEditTime()).isEqualTo(DEFAULT_LAST_EDIT_TIME);
    }

    @Test
    @Transactional
    void createDiaryPageWithExistingId() throws Exception {
        // Create the DiaryPage with an existing ID
        diaryPage.setId(1L);

        int databaseSizeBeforeCreate = diaryPageRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restDiaryPageMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(diaryPage)))
            .andExpect(status().isBadRequest());

        // Validate the DiaryPage in the database
        List<DiaryPage> diaryPageList = diaryPageRepository.findAll();
        assertThat(diaryPageList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkPageDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = diaryPageRepository.findAll().size();
        // set the field null
        diaryPage.setPageDate(null);

        // Create the DiaryPage, which fails.

        restDiaryPageMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(diaryPage)))
            .andExpect(status().isBadRequest());

        List<DiaryPage> diaryPageList = diaryPageRepository.findAll();
        assertThat(diaryPageList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkCreationTimeIsRequired() throws Exception {
        int databaseSizeBeforeTest = diaryPageRepository.findAll().size();
        // set the field null
        diaryPage.setCreationTime(null);

        // Create the DiaryPage, which fails.

        restDiaryPageMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(diaryPage)))
            .andExpect(status().isBadRequest());

        List<DiaryPage> diaryPageList = diaryPageRepository.findAll();
        assertThat(diaryPageList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkLastEditTimeIsRequired() throws Exception {
        int databaseSizeBeforeTest = diaryPageRepository.findAll().size();
        // set the field null
        diaryPage.setLastEditTime(null);

        // Create the DiaryPage, which fails.

        restDiaryPageMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(diaryPage)))
            .andExpect(status().isBadRequest());

        List<DiaryPage> diaryPageList = diaryPageRepository.findAll();
        assertThat(diaryPageList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllDiaryPages() throws Exception {
        // Initialize the database
        diaryPageRepository.saveAndFlush(diaryPage);

        // Get all the diaryPageList
        restDiaryPageMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(diaryPage.getId().intValue())))
            .andExpect(jsonPath("$.[*].pageDate").value(hasItem(sameInstant(DEFAULT_PAGE_DATE))))
            .andExpect(jsonPath("$.[*].pageDescription").value(hasItem(DEFAULT_PAGE_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].creationTime").value(hasItem(DEFAULT_CREATION_TIME.toString())))
            .andExpect(jsonPath("$.[*].lastEditTime").value(hasItem(DEFAULT_LAST_EDIT_TIME.toString())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllDiaryPagesWithEagerRelationshipsIsEnabled() throws Exception {
        when(diaryPageRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restDiaryPageMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(diaryPageRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllDiaryPagesWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(diaryPageRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restDiaryPageMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(diaryPageRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getDiaryPage() throws Exception {
        // Initialize the database
        diaryPageRepository.saveAndFlush(diaryPage);

        // Get the diaryPage
        restDiaryPageMockMvc
            .perform(get(ENTITY_API_URL_ID, diaryPage.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(diaryPage.getId().intValue()))
            .andExpect(jsonPath("$.pageDate").value(sameInstant(DEFAULT_PAGE_DATE)))
            .andExpect(jsonPath("$.pageDescription").value(DEFAULT_PAGE_DESCRIPTION))
            .andExpect(jsonPath("$.creationTime").value(DEFAULT_CREATION_TIME.toString()))
            .andExpect(jsonPath("$.lastEditTime").value(DEFAULT_LAST_EDIT_TIME.toString()));
    }

    @Test
    @Transactional
    void getNonExistingDiaryPage() throws Exception {
        // Get the diaryPage
        restDiaryPageMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingDiaryPage() throws Exception {
        // Initialize the database
        diaryPageRepository.saveAndFlush(diaryPage);

        int databaseSizeBeforeUpdate = diaryPageRepository.findAll().size();

        // Update the diaryPage
        DiaryPage updatedDiaryPage = diaryPageRepository.findById(diaryPage.getId()).get();
        // Disconnect from session so that the updates on updatedDiaryPage are not directly saved in db
        em.detach(updatedDiaryPage);
        updatedDiaryPage
            .pageDate(UPDATED_PAGE_DATE)
            .pageDescription(UPDATED_PAGE_DESCRIPTION)
            .creationTime(UPDATED_CREATION_TIME)
            .lastEditTime(UPDATED_LAST_EDIT_TIME);

        restDiaryPageMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedDiaryPage.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedDiaryPage))
            )
            .andExpect(status().isOk());

        // Validate the DiaryPage in the database
        List<DiaryPage> diaryPageList = diaryPageRepository.findAll();
        assertThat(diaryPageList).hasSize(databaseSizeBeforeUpdate);
        DiaryPage testDiaryPage = diaryPageList.get(diaryPageList.size() - 1);
        assertThat(testDiaryPage.getPageDate()).isEqualTo(UPDATED_PAGE_DATE);
        assertThat(testDiaryPage.getPageDescription()).isEqualTo(UPDATED_PAGE_DESCRIPTION);
        assertThat(testDiaryPage.getCreationTime()).isEqualTo(UPDATED_CREATION_TIME);
        assertThat(testDiaryPage.getLastEditTime()).isEqualTo(UPDATED_LAST_EDIT_TIME);
    }

    @Test
    @Transactional
    void putNonExistingDiaryPage() throws Exception {
        int databaseSizeBeforeUpdate = diaryPageRepository.findAll().size();
        diaryPage.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDiaryPageMockMvc
            .perform(
                put(ENTITY_API_URL_ID, diaryPage.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(diaryPage))
            )
            .andExpect(status().isBadRequest());

        // Validate the DiaryPage in the database
        List<DiaryPage> diaryPageList = diaryPageRepository.findAll();
        assertThat(diaryPageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchDiaryPage() throws Exception {
        int databaseSizeBeforeUpdate = diaryPageRepository.findAll().size();
        diaryPage.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDiaryPageMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(diaryPage))
            )
            .andExpect(status().isBadRequest());

        // Validate the DiaryPage in the database
        List<DiaryPage> diaryPageList = diaryPageRepository.findAll();
        assertThat(diaryPageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamDiaryPage() throws Exception {
        int databaseSizeBeforeUpdate = diaryPageRepository.findAll().size();
        diaryPage.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDiaryPageMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(diaryPage)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the DiaryPage in the database
        List<DiaryPage> diaryPageList = diaryPageRepository.findAll();
        assertThat(diaryPageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateDiaryPageWithPatch() throws Exception {
        // Initialize the database
        diaryPageRepository.saveAndFlush(diaryPage);

        int databaseSizeBeforeUpdate = diaryPageRepository.findAll().size();

        // Update the diaryPage using partial update
        DiaryPage partialUpdatedDiaryPage = new DiaryPage();
        partialUpdatedDiaryPage.setId(diaryPage.getId());

        partialUpdatedDiaryPage.pageDate(UPDATED_PAGE_DATE);

        restDiaryPageMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDiaryPage.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDiaryPage))
            )
            .andExpect(status().isOk());

        // Validate the DiaryPage in the database
        List<DiaryPage> diaryPageList = diaryPageRepository.findAll();
        assertThat(diaryPageList).hasSize(databaseSizeBeforeUpdate);
        DiaryPage testDiaryPage = diaryPageList.get(diaryPageList.size() - 1);
        assertThat(testDiaryPage.getPageDate()).isEqualTo(UPDATED_PAGE_DATE);
        assertThat(testDiaryPage.getPageDescription()).isEqualTo(DEFAULT_PAGE_DESCRIPTION);
        assertThat(testDiaryPage.getCreationTime()).isEqualTo(DEFAULT_CREATION_TIME);
        assertThat(testDiaryPage.getLastEditTime()).isEqualTo(DEFAULT_LAST_EDIT_TIME);
    }

    @Test
    @Transactional
    void fullUpdateDiaryPageWithPatch() throws Exception {
        // Initialize the database
        diaryPageRepository.saveAndFlush(diaryPage);

        int databaseSizeBeforeUpdate = diaryPageRepository.findAll().size();

        // Update the diaryPage using partial update
        DiaryPage partialUpdatedDiaryPage = new DiaryPage();
        partialUpdatedDiaryPage.setId(diaryPage.getId());

        partialUpdatedDiaryPage
            .pageDate(UPDATED_PAGE_DATE)
            .pageDescription(UPDATED_PAGE_DESCRIPTION)
            .creationTime(UPDATED_CREATION_TIME)
            .lastEditTime(UPDATED_LAST_EDIT_TIME);

        restDiaryPageMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDiaryPage.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDiaryPage))
            )
            .andExpect(status().isOk());

        // Validate the DiaryPage in the database
        List<DiaryPage> diaryPageList = diaryPageRepository.findAll();
        assertThat(diaryPageList).hasSize(databaseSizeBeforeUpdate);
        DiaryPage testDiaryPage = diaryPageList.get(diaryPageList.size() - 1);
        assertThat(testDiaryPage.getPageDate()).isEqualTo(UPDATED_PAGE_DATE);
        assertThat(testDiaryPage.getPageDescription()).isEqualTo(UPDATED_PAGE_DESCRIPTION);
        assertThat(testDiaryPage.getCreationTime()).isEqualTo(UPDATED_CREATION_TIME);
        assertThat(testDiaryPage.getLastEditTime()).isEqualTo(UPDATED_LAST_EDIT_TIME);
    }

    @Test
    @Transactional
    void patchNonExistingDiaryPage() throws Exception {
        int databaseSizeBeforeUpdate = diaryPageRepository.findAll().size();
        diaryPage.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDiaryPageMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, diaryPage.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(diaryPage))
            )
            .andExpect(status().isBadRequest());

        // Validate the DiaryPage in the database
        List<DiaryPage> diaryPageList = diaryPageRepository.findAll();
        assertThat(diaryPageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchDiaryPage() throws Exception {
        int databaseSizeBeforeUpdate = diaryPageRepository.findAll().size();
        diaryPage.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDiaryPageMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(diaryPage))
            )
            .andExpect(status().isBadRequest());

        // Validate the DiaryPage in the database
        List<DiaryPage> diaryPageList = diaryPageRepository.findAll();
        assertThat(diaryPageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamDiaryPage() throws Exception {
        int databaseSizeBeforeUpdate = diaryPageRepository.findAll().size();
        diaryPage.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDiaryPageMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(diaryPage))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the DiaryPage in the database
        List<DiaryPage> diaryPageList = diaryPageRepository.findAll();
        assertThat(diaryPageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteDiaryPage() throws Exception {
        // Initialize the database
        diaryPageRepository.saveAndFlush(diaryPage);

        int databaseSizeBeforeDelete = diaryPageRepository.findAll().size();

        // Delete the diaryPage
        restDiaryPageMockMvc
            .perform(delete(ENTITY_API_URL_ID, diaryPage.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<DiaryPage> diaryPageList = diaryPageRepository.findAll();
        assertThat(diaryPageList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
