package uk.ac.bham.teamproject.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.time.Instant;
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
import uk.ac.bham.teamproject.domain.ToDoItem;
import uk.ac.bham.teamproject.repository.ToDoItemRepository;

/**
 * Integration tests for the {@link ToDoItemResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class ToDoItemResourceIT {

    private static final String DEFAULT_TO_DO_ITEM_HEADING = "AAAAAAAAAA";
    private static final String UPDATED_TO_DO_ITEM_HEADING = "BBBBBBBBBB";

    private static final String DEFAULT_TO_DO_ITEM_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_TO_DO_ITEM_DESCRIPTION = "BBBBBBBBBB";

    private static final Instant DEFAULT_TO_DO_ITEM_STATUS = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_TO_DO_ITEM_STATUS = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/to-do-items";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ToDoItemRepository toDoItemRepository;

    @Mock
    private ToDoItemRepository toDoItemRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restToDoItemMockMvc;

    private ToDoItem toDoItem;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ToDoItem createEntity(EntityManager em) {
        ToDoItem toDoItem = new ToDoItem()
            .toDoItemHeading(DEFAULT_TO_DO_ITEM_HEADING)
            .toDoItemDescription(DEFAULT_TO_DO_ITEM_DESCRIPTION)
            .toDoItemStatus(DEFAULT_TO_DO_ITEM_STATUS);
        return toDoItem;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ToDoItem createUpdatedEntity(EntityManager em) {
        ToDoItem toDoItem = new ToDoItem()
            .toDoItemHeading(UPDATED_TO_DO_ITEM_HEADING)
            .toDoItemDescription(UPDATED_TO_DO_ITEM_DESCRIPTION)
            .toDoItemStatus(UPDATED_TO_DO_ITEM_STATUS);
        return toDoItem;
    }

    @BeforeEach
    public void initTest() {
        toDoItem = createEntity(em);
    }

    @Test
    @Transactional
    void createToDoItem() throws Exception {
        int databaseSizeBeforeCreate = toDoItemRepository.findAll().size();
        // Create the ToDoItem
        restToDoItemMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(toDoItem)))
            .andExpect(status().isCreated());

        // Validate the ToDoItem in the database
        List<ToDoItem> toDoItemList = toDoItemRepository.findAll();
        assertThat(toDoItemList).hasSize(databaseSizeBeforeCreate + 1);
        ToDoItem testToDoItem = toDoItemList.get(toDoItemList.size() - 1);
        assertThat(testToDoItem.getToDoItemHeading()).isEqualTo(DEFAULT_TO_DO_ITEM_HEADING);
        assertThat(testToDoItem.getToDoItemDescription()).isEqualTo(DEFAULT_TO_DO_ITEM_DESCRIPTION);
        assertThat(testToDoItem.getToDoItemStatus()).isEqualTo(DEFAULT_TO_DO_ITEM_STATUS);
    }

    @Test
    @Transactional
    void createToDoItemWithExistingId() throws Exception {
        // Create the ToDoItem with an existing ID
        toDoItem.setId(1L);

        int databaseSizeBeforeCreate = toDoItemRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restToDoItemMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(toDoItem)))
            .andExpect(status().isBadRequest());

        // Validate the ToDoItem in the database
        List<ToDoItem> toDoItemList = toDoItemRepository.findAll();
        assertThat(toDoItemList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkToDoItemHeadingIsRequired() throws Exception {
        int databaseSizeBeforeTest = toDoItemRepository.findAll().size();
        // set the field null
        toDoItem.setToDoItemHeading(null);

        // Create the ToDoItem, which fails.

        restToDoItemMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(toDoItem)))
            .andExpect(status().isBadRequest());

        List<ToDoItem> toDoItemList = toDoItemRepository.findAll();
        assertThat(toDoItemList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkToDoItemStatusIsRequired() throws Exception {
        int databaseSizeBeforeTest = toDoItemRepository.findAll().size();
        // set the field null
        toDoItem.setToDoItemStatus(null);

        // Create the ToDoItem, which fails.

        restToDoItemMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(toDoItem)))
            .andExpect(status().isBadRequest());

        List<ToDoItem> toDoItemList = toDoItemRepository.findAll();
        assertThat(toDoItemList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllToDoItems() throws Exception {
        // Initialize the database
        toDoItemRepository.saveAndFlush(toDoItem);

        // Get all the toDoItemList
        restToDoItemMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(toDoItem.getId().intValue())))
            .andExpect(jsonPath("$.[*].toDoItemHeading").value(hasItem(DEFAULT_TO_DO_ITEM_HEADING)))
            .andExpect(jsonPath("$.[*].toDoItemDescription").value(hasItem(DEFAULT_TO_DO_ITEM_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].toDoItemStatus").value(hasItem(DEFAULT_TO_DO_ITEM_STATUS.toString())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllToDoItemsWithEagerRelationshipsIsEnabled() throws Exception {
        when(toDoItemRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restToDoItemMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(toDoItemRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllToDoItemsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(toDoItemRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restToDoItemMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(toDoItemRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getToDoItem() throws Exception {
        // Initialize the database
        toDoItemRepository.saveAndFlush(toDoItem);

        // Get the toDoItem
        restToDoItemMockMvc
            .perform(get(ENTITY_API_URL_ID, toDoItem.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(toDoItem.getId().intValue()))
            .andExpect(jsonPath("$.toDoItemHeading").value(DEFAULT_TO_DO_ITEM_HEADING))
            .andExpect(jsonPath("$.toDoItemDescription").value(DEFAULT_TO_DO_ITEM_DESCRIPTION))
            .andExpect(jsonPath("$.toDoItemStatus").value(DEFAULT_TO_DO_ITEM_STATUS.toString()));
    }

    @Test
    @Transactional
    void getNonExistingToDoItem() throws Exception {
        // Get the toDoItem
        restToDoItemMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingToDoItem() throws Exception {
        // Initialize the database
        toDoItemRepository.saveAndFlush(toDoItem);

        int databaseSizeBeforeUpdate = toDoItemRepository.findAll().size();

        // Update the toDoItem
        ToDoItem updatedToDoItem = toDoItemRepository.findById(toDoItem.getId()).get();
        // Disconnect from session so that the updates on updatedToDoItem are not directly saved in db
        em.detach(updatedToDoItem);
        updatedToDoItem
            .toDoItemHeading(UPDATED_TO_DO_ITEM_HEADING)
            .toDoItemDescription(UPDATED_TO_DO_ITEM_DESCRIPTION)
            .toDoItemStatus(UPDATED_TO_DO_ITEM_STATUS);

        restToDoItemMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedToDoItem.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedToDoItem))
            )
            .andExpect(status().isOk());

        // Validate the ToDoItem in the database
        List<ToDoItem> toDoItemList = toDoItemRepository.findAll();
        assertThat(toDoItemList).hasSize(databaseSizeBeforeUpdate);
        ToDoItem testToDoItem = toDoItemList.get(toDoItemList.size() - 1);
        assertThat(testToDoItem.getToDoItemHeading()).isEqualTo(UPDATED_TO_DO_ITEM_HEADING);
        assertThat(testToDoItem.getToDoItemDescription()).isEqualTo(UPDATED_TO_DO_ITEM_DESCRIPTION);
        assertThat(testToDoItem.getToDoItemStatus()).isEqualTo(UPDATED_TO_DO_ITEM_STATUS);
    }

    @Test
    @Transactional
    void putNonExistingToDoItem() throws Exception {
        int databaseSizeBeforeUpdate = toDoItemRepository.findAll().size();
        toDoItem.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restToDoItemMockMvc
            .perform(
                put(ENTITY_API_URL_ID, toDoItem.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(toDoItem))
            )
            .andExpect(status().isBadRequest());

        // Validate the ToDoItem in the database
        List<ToDoItem> toDoItemList = toDoItemRepository.findAll();
        assertThat(toDoItemList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchToDoItem() throws Exception {
        int databaseSizeBeforeUpdate = toDoItemRepository.findAll().size();
        toDoItem.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restToDoItemMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(toDoItem))
            )
            .andExpect(status().isBadRequest());

        // Validate the ToDoItem in the database
        List<ToDoItem> toDoItemList = toDoItemRepository.findAll();
        assertThat(toDoItemList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamToDoItem() throws Exception {
        int databaseSizeBeforeUpdate = toDoItemRepository.findAll().size();
        toDoItem.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restToDoItemMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(toDoItem)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the ToDoItem in the database
        List<ToDoItem> toDoItemList = toDoItemRepository.findAll();
        assertThat(toDoItemList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateToDoItemWithPatch() throws Exception {
        // Initialize the database
        toDoItemRepository.saveAndFlush(toDoItem);

        int databaseSizeBeforeUpdate = toDoItemRepository.findAll().size();

        // Update the toDoItem using partial update
        ToDoItem partialUpdatedToDoItem = new ToDoItem();
        partialUpdatedToDoItem.setId(toDoItem.getId());

        partialUpdatedToDoItem.toDoItemStatus(UPDATED_TO_DO_ITEM_STATUS);

        restToDoItemMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedToDoItem.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedToDoItem))
            )
            .andExpect(status().isOk());

        // Validate the ToDoItem in the database
        List<ToDoItem> toDoItemList = toDoItemRepository.findAll();
        assertThat(toDoItemList).hasSize(databaseSizeBeforeUpdate);
        ToDoItem testToDoItem = toDoItemList.get(toDoItemList.size() - 1);
        assertThat(testToDoItem.getToDoItemHeading()).isEqualTo(DEFAULT_TO_DO_ITEM_HEADING);
        assertThat(testToDoItem.getToDoItemDescription()).isEqualTo(DEFAULT_TO_DO_ITEM_DESCRIPTION);
        assertThat(testToDoItem.getToDoItemStatus()).isEqualTo(UPDATED_TO_DO_ITEM_STATUS);
    }

    @Test
    @Transactional
    void fullUpdateToDoItemWithPatch() throws Exception {
        // Initialize the database
        toDoItemRepository.saveAndFlush(toDoItem);

        int databaseSizeBeforeUpdate = toDoItemRepository.findAll().size();

        // Update the toDoItem using partial update
        ToDoItem partialUpdatedToDoItem = new ToDoItem();
        partialUpdatedToDoItem.setId(toDoItem.getId());

        partialUpdatedToDoItem
            .toDoItemHeading(UPDATED_TO_DO_ITEM_HEADING)
            .toDoItemDescription(UPDATED_TO_DO_ITEM_DESCRIPTION)
            .toDoItemStatus(UPDATED_TO_DO_ITEM_STATUS);

        restToDoItemMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedToDoItem.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedToDoItem))
            )
            .andExpect(status().isOk());

        // Validate the ToDoItem in the database
        List<ToDoItem> toDoItemList = toDoItemRepository.findAll();
        assertThat(toDoItemList).hasSize(databaseSizeBeforeUpdate);
        ToDoItem testToDoItem = toDoItemList.get(toDoItemList.size() - 1);
        assertThat(testToDoItem.getToDoItemHeading()).isEqualTo(UPDATED_TO_DO_ITEM_HEADING);
        assertThat(testToDoItem.getToDoItemDescription()).isEqualTo(UPDATED_TO_DO_ITEM_DESCRIPTION);
        assertThat(testToDoItem.getToDoItemStatus()).isEqualTo(UPDATED_TO_DO_ITEM_STATUS);
    }

    @Test
    @Transactional
    void patchNonExistingToDoItem() throws Exception {
        int databaseSizeBeforeUpdate = toDoItemRepository.findAll().size();
        toDoItem.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restToDoItemMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, toDoItem.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(toDoItem))
            )
            .andExpect(status().isBadRequest());

        // Validate the ToDoItem in the database
        List<ToDoItem> toDoItemList = toDoItemRepository.findAll();
        assertThat(toDoItemList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchToDoItem() throws Exception {
        int databaseSizeBeforeUpdate = toDoItemRepository.findAll().size();
        toDoItem.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restToDoItemMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(toDoItem))
            )
            .andExpect(status().isBadRequest());

        // Validate the ToDoItem in the database
        List<ToDoItem> toDoItemList = toDoItemRepository.findAll();
        assertThat(toDoItemList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamToDoItem() throws Exception {
        int databaseSizeBeforeUpdate = toDoItemRepository.findAll().size();
        toDoItem.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restToDoItemMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(toDoItem)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the ToDoItem in the database
        List<ToDoItem> toDoItemList = toDoItemRepository.findAll();
        assertThat(toDoItemList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteToDoItem() throws Exception {
        // Initialize the database
        toDoItemRepository.saveAndFlush(toDoItem);

        int databaseSizeBeforeDelete = toDoItemRepository.findAll().size();

        // Delete the toDoItem
        restToDoItemMockMvc
            .perform(delete(ENTITY_API_URL_ID, toDoItem.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ToDoItem> toDoItemList = toDoItemRepository.findAll();
        assertThat(toDoItemList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
