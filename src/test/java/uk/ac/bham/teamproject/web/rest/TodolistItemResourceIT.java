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
import uk.ac.bham.teamproject.domain.TodolistItem;
import uk.ac.bham.teamproject.repository.TodolistItemRepository;

/**
 * Integration tests for the {@link TodolistItemResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class TodolistItemResourceIT {

    private static final String DEFAULT_HEADING = "AAAAAAAAAA";
    private static final String UPDATED_HEADING = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final Instant DEFAULT_CREATION_TIME = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_CREATION_TIME = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Instant DEFAULT_LAST_EDIT_TIME = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_LAST_EDIT_TIME = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Boolean DEFAULT_COMPLETED = false;
    private static final Boolean UPDATED_COMPLETED = true;

    private static final String ENTITY_API_URL = "/api/todolist-items";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private TodolistItemRepository todolistItemRepository;

    @Mock
    private TodolistItemRepository todolistItemRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restTodolistItemMockMvc;

    private TodolistItem todolistItem;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TodolistItem createEntity(EntityManager em) {
        TodolistItem todolistItem = new TodolistItem()
            .heading(DEFAULT_HEADING)
            .description(DEFAULT_DESCRIPTION)
            .creationTime(DEFAULT_CREATION_TIME)
            .lastEditTime(DEFAULT_LAST_EDIT_TIME)
            .completed(DEFAULT_COMPLETED);
        return todolistItem;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TodolistItem createUpdatedEntity(EntityManager em) {
        TodolistItem todolistItem = new TodolistItem()
            .heading(UPDATED_HEADING)
            .description(UPDATED_DESCRIPTION)
            .creationTime(UPDATED_CREATION_TIME)
            .lastEditTime(UPDATED_LAST_EDIT_TIME)
            .completed(UPDATED_COMPLETED);
        return todolistItem;
    }

    @BeforeEach
    public void initTest() {
        todolistItem = createEntity(em);
    }

    @Test
    @Transactional
    void createTodolistItem() throws Exception {
        int databaseSizeBeforeCreate = todolistItemRepository.findAll().size();
        // Create the TodolistItem
        restTodolistItemMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(todolistItem)))
            .andExpect(status().isCreated());

        // Validate the TodolistItem in the database
        List<TodolistItem> todolistItemList = todolistItemRepository.findAll();
        assertThat(todolistItemList).hasSize(databaseSizeBeforeCreate + 1);
        TodolistItem testTodolistItem = todolistItemList.get(todolistItemList.size() - 1);
        assertThat(testTodolistItem.getHeading()).isEqualTo(DEFAULT_HEADING);
        assertThat(testTodolistItem.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testTodolistItem.getCreationTime()).isEqualTo(DEFAULT_CREATION_TIME);
        assertThat(testTodolistItem.getLastEditTime()).isEqualTo(DEFAULT_LAST_EDIT_TIME);
        assertThat(testTodolistItem.getCompleted()).isEqualTo(DEFAULT_COMPLETED);
    }

    @Test
    @Transactional
    void createTodolistItemWithExistingId() throws Exception {
        // Create the TodolistItem with an existing ID
        todolistItem.setId(1L);

        int databaseSizeBeforeCreate = todolistItemRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restTodolistItemMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(todolistItem)))
            .andExpect(status().isBadRequest());

        // Validate the TodolistItem in the database
        List<TodolistItem> todolistItemList = todolistItemRepository.findAll();
        assertThat(todolistItemList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkHeadingIsRequired() throws Exception {
        int databaseSizeBeforeTest = todolistItemRepository.findAll().size();
        // set the field null
        todolistItem.setHeading(null);

        // Create the TodolistItem, which fails.

        restTodolistItemMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(todolistItem)))
            .andExpect(status().isBadRequest());

        List<TodolistItem> todolistItemList = todolistItemRepository.findAll();
        assertThat(todolistItemList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkDescriptionIsRequired() throws Exception {
        int databaseSizeBeforeTest = todolistItemRepository.findAll().size();
        // set the field null
        todolistItem.setDescription(null);

        // Create the TodolistItem, which fails.

        restTodolistItemMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(todolistItem)))
            .andExpect(status().isBadRequest());

        List<TodolistItem> todolistItemList = todolistItemRepository.findAll();
        assertThat(todolistItemList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkCreationTimeIsRequired() throws Exception {
        int databaseSizeBeforeTest = todolistItemRepository.findAll().size();
        // set the field null
        todolistItem.setCreationTime(null);

        // Create the TodolistItem, which fails.

        restTodolistItemMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(todolistItem)))
            .andExpect(status().isBadRequest());

        List<TodolistItem> todolistItemList = todolistItemRepository.findAll();
        assertThat(todolistItemList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkLastEditTimeIsRequired() throws Exception {
        int databaseSizeBeforeTest = todolistItemRepository.findAll().size();
        // set the field null
        todolistItem.setLastEditTime(null);

        // Create the TodolistItem, which fails.

        restTodolistItemMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(todolistItem)))
            .andExpect(status().isBadRequest());

        List<TodolistItem> todolistItemList = todolistItemRepository.findAll();
        assertThat(todolistItemList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkCompletedIsRequired() throws Exception {
        int databaseSizeBeforeTest = todolistItemRepository.findAll().size();
        // set the field null
        todolistItem.setCompleted(null);

        // Create the TodolistItem, which fails.

        restTodolistItemMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(todolistItem)))
            .andExpect(status().isBadRequest());

        List<TodolistItem> todolistItemList = todolistItemRepository.findAll();
        assertThat(todolistItemList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllTodolistItems() throws Exception {
        // Initialize the database
        todolistItemRepository.saveAndFlush(todolistItem);

        // Get all the todolistItemList
        restTodolistItemMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(todolistItem.getId().intValue())))
            .andExpect(jsonPath("$.[*].heading").value(hasItem(DEFAULT_HEADING)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].creationTime").value(hasItem(DEFAULT_CREATION_TIME.toString())))
            .andExpect(jsonPath("$.[*].lastEditTime").value(hasItem(DEFAULT_LAST_EDIT_TIME.toString())))
            .andExpect(jsonPath("$.[*].completed").value(hasItem(DEFAULT_COMPLETED.booleanValue())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllTodolistItemsWithEagerRelationshipsIsEnabled() throws Exception {
        when(todolistItemRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restTodolistItemMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(todolistItemRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllTodolistItemsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(todolistItemRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restTodolistItemMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(todolistItemRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getTodolistItem() throws Exception {
        // Initialize the database
        todolistItemRepository.saveAndFlush(todolistItem);

        // Get the todolistItem
        restTodolistItemMockMvc
            .perform(get(ENTITY_API_URL_ID, todolistItem.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(todolistItem.getId().intValue()))
            .andExpect(jsonPath("$.heading").value(DEFAULT_HEADING))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.creationTime").value(DEFAULT_CREATION_TIME.toString()))
            .andExpect(jsonPath("$.lastEditTime").value(DEFAULT_LAST_EDIT_TIME.toString()))
            .andExpect(jsonPath("$.completed").value(DEFAULT_COMPLETED.booleanValue()));
    }

    @Test
    @Transactional
    void getNonExistingTodolistItem() throws Exception {
        // Get the todolistItem
        restTodolistItemMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingTodolistItem() throws Exception {
        // Initialize the database
        todolistItemRepository.saveAndFlush(todolistItem);

        int databaseSizeBeforeUpdate = todolistItemRepository.findAll().size();

        // Update the todolistItem
        TodolistItem updatedTodolistItem = todolistItemRepository.findById(todolistItem.getId()).get();
        // Disconnect from session so that the updates on updatedTodolistItem are not directly saved in db
        em.detach(updatedTodolistItem);
        updatedTodolistItem
            .heading(UPDATED_HEADING)
            .description(UPDATED_DESCRIPTION)
            .creationTime(UPDATED_CREATION_TIME)
            .lastEditTime(UPDATED_LAST_EDIT_TIME)
            .completed(UPDATED_COMPLETED);

        restTodolistItemMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedTodolistItem.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedTodolistItem))
            )
            .andExpect(status().isOk());

        // Validate the TodolistItem in the database
        List<TodolistItem> todolistItemList = todolistItemRepository.findAll();
        assertThat(todolistItemList).hasSize(databaseSizeBeforeUpdate);
        TodolistItem testTodolistItem = todolistItemList.get(todolistItemList.size() - 1);
        assertThat(testTodolistItem.getHeading()).isEqualTo(UPDATED_HEADING);
        assertThat(testTodolistItem.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testTodolistItem.getCreationTime()).isEqualTo(UPDATED_CREATION_TIME);
        assertThat(testTodolistItem.getLastEditTime()).isEqualTo(UPDATED_LAST_EDIT_TIME);
        assertThat(testTodolistItem.getCompleted()).isEqualTo(UPDATED_COMPLETED);
    }

    @Test
    @Transactional
    void putNonExistingTodolistItem() throws Exception {
        int databaseSizeBeforeUpdate = todolistItemRepository.findAll().size();
        todolistItem.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTodolistItemMockMvc
            .perform(
                put(ENTITY_API_URL_ID, todolistItem.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(todolistItem))
            )
            .andExpect(status().isBadRequest());

        // Validate the TodolistItem in the database
        List<TodolistItem> todolistItemList = todolistItemRepository.findAll();
        assertThat(todolistItemList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchTodolistItem() throws Exception {
        int databaseSizeBeforeUpdate = todolistItemRepository.findAll().size();
        todolistItem.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTodolistItemMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(todolistItem))
            )
            .andExpect(status().isBadRequest());

        // Validate the TodolistItem in the database
        List<TodolistItem> todolistItemList = todolistItemRepository.findAll();
        assertThat(todolistItemList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamTodolistItem() throws Exception {
        int databaseSizeBeforeUpdate = todolistItemRepository.findAll().size();
        todolistItem.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTodolistItemMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(todolistItem)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the TodolistItem in the database
        List<TodolistItem> todolistItemList = todolistItemRepository.findAll();
        assertThat(todolistItemList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateTodolistItemWithPatch() throws Exception {
        // Initialize the database
        todolistItemRepository.saveAndFlush(todolistItem);

        int databaseSizeBeforeUpdate = todolistItemRepository.findAll().size();

        // Update the todolistItem using partial update
        TodolistItem partialUpdatedTodolistItem = new TodolistItem();
        partialUpdatedTodolistItem.setId(todolistItem.getId());

        partialUpdatedTodolistItem
            .description(UPDATED_DESCRIPTION)
            .creationTime(UPDATED_CREATION_TIME)
            .lastEditTime(UPDATED_LAST_EDIT_TIME)
            .completed(UPDATED_COMPLETED);

        restTodolistItemMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTodolistItem.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTodolistItem))
            )
            .andExpect(status().isOk());

        // Validate the TodolistItem in the database
        List<TodolistItem> todolistItemList = todolistItemRepository.findAll();
        assertThat(todolistItemList).hasSize(databaseSizeBeforeUpdate);
        TodolistItem testTodolistItem = todolistItemList.get(todolistItemList.size() - 1);
        assertThat(testTodolistItem.getHeading()).isEqualTo(DEFAULT_HEADING);
        assertThat(testTodolistItem.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testTodolistItem.getCreationTime()).isEqualTo(UPDATED_CREATION_TIME);
        assertThat(testTodolistItem.getLastEditTime()).isEqualTo(UPDATED_LAST_EDIT_TIME);
        assertThat(testTodolistItem.getCompleted()).isEqualTo(UPDATED_COMPLETED);
    }

    @Test
    @Transactional
    void fullUpdateTodolistItemWithPatch() throws Exception {
        // Initialize the database
        todolistItemRepository.saveAndFlush(todolistItem);

        int databaseSizeBeforeUpdate = todolistItemRepository.findAll().size();

        // Update the todolistItem using partial update
        TodolistItem partialUpdatedTodolistItem = new TodolistItem();
        partialUpdatedTodolistItem.setId(todolistItem.getId());

        partialUpdatedTodolistItem
            .heading(UPDATED_HEADING)
            .description(UPDATED_DESCRIPTION)
            .creationTime(UPDATED_CREATION_TIME)
            .lastEditTime(UPDATED_LAST_EDIT_TIME)
            .completed(UPDATED_COMPLETED);

        restTodolistItemMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTodolistItem.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTodolistItem))
            )
            .andExpect(status().isOk());

        // Validate the TodolistItem in the database
        List<TodolistItem> todolistItemList = todolistItemRepository.findAll();
        assertThat(todolistItemList).hasSize(databaseSizeBeforeUpdate);
        TodolistItem testTodolistItem = todolistItemList.get(todolistItemList.size() - 1);
        assertThat(testTodolistItem.getHeading()).isEqualTo(UPDATED_HEADING);
        assertThat(testTodolistItem.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testTodolistItem.getCreationTime()).isEqualTo(UPDATED_CREATION_TIME);
        assertThat(testTodolistItem.getLastEditTime()).isEqualTo(UPDATED_LAST_EDIT_TIME);
        assertThat(testTodolistItem.getCompleted()).isEqualTo(UPDATED_COMPLETED);
    }

    @Test
    @Transactional
    void patchNonExistingTodolistItem() throws Exception {
        int databaseSizeBeforeUpdate = todolistItemRepository.findAll().size();
        todolistItem.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTodolistItemMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, todolistItem.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(todolistItem))
            )
            .andExpect(status().isBadRequest());

        // Validate the TodolistItem in the database
        List<TodolistItem> todolistItemList = todolistItemRepository.findAll();
        assertThat(todolistItemList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchTodolistItem() throws Exception {
        int databaseSizeBeforeUpdate = todolistItemRepository.findAll().size();
        todolistItem.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTodolistItemMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(todolistItem))
            )
            .andExpect(status().isBadRequest());

        // Validate the TodolistItem in the database
        List<TodolistItem> todolistItemList = todolistItemRepository.findAll();
        assertThat(todolistItemList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamTodolistItem() throws Exception {
        int databaseSizeBeforeUpdate = todolistItemRepository.findAll().size();
        todolistItem.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTodolistItemMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(todolistItem))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the TodolistItem in the database
        List<TodolistItem> todolistItemList = todolistItemRepository.findAll();
        assertThat(todolistItemList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteTodolistItem() throws Exception {
        // Initialize the database
        todolistItemRepository.saveAndFlush(todolistItem);

        int databaseSizeBeforeDelete = todolistItemRepository.findAll().size();

        // Delete the todolistItem
        restTodolistItemMockMvc
            .perform(delete(ENTITY_API_URL_ID, todolistItem.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<TodolistItem> todolistItemList = todolistItemRepository.findAll();
        assertThat(todolistItemList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
