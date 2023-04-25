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
import uk.ac.bham.teamproject.domain.AntiprocrastinationListTwo;
import uk.ac.bham.teamproject.repository.AntiprocrastinationListTwoRepository;

/**
 * Integration tests for the {@link AntiprocrastinationListTwoResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class AntiprocrastinationListTwoResourceIT {

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

    private static final String ENTITY_API_URL = "/api/antiprocrastination-list-twos";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private AntiprocrastinationListTwoRepository antiprocrastinationListTwoRepository;

    @Mock
    private AntiprocrastinationListTwoRepository antiprocrastinationListTwoRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAntiprocrastinationListTwoMockMvc;

    private AntiprocrastinationListTwo antiprocrastinationListTwo;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AntiprocrastinationListTwo createEntity(EntityManager em) {
        AntiprocrastinationListTwo antiprocrastinationListTwo = new AntiprocrastinationListTwo()
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
        return antiprocrastinationListTwo;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AntiprocrastinationListTwo createUpdatedEntity(EntityManager em) {
        AntiprocrastinationListTwo antiprocrastinationListTwo = new AntiprocrastinationListTwo()
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
        return antiprocrastinationListTwo;
    }

    @BeforeEach
    public void initTest() {
        antiprocrastinationListTwo = createEntity(em);
    }

    @Test
    @Transactional
    void createAntiprocrastinationListTwo() throws Exception {
        int databaseSizeBeforeCreate = antiprocrastinationListTwoRepository.findAll().size();
        // Create the AntiprocrastinationListTwo
        restAntiprocrastinationListTwoMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(antiprocrastinationListTwo))
            )
            .andExpect(status().isCreated());

        // Validate the AntiprocrastinationListTwo in the database
        List<AntiprocrastinationListTwo> antiprocrastinationListTwoList = antiprocrastinationListTwoRepository.findAll();
        assertThat(antiprocrastinationListTwoList).hasSize(databaseSizeBeforeCreate + 1);
        AntiprocrastinationListTwo testAntiprocrastinationListTwo = antiprocrastinationListTwoList.get(
            antiprocrastinationListTwoList.size() - 1
        );
        assertThat(testAntiprocrastinationListTwo.getLink()).isEqualTo(DEFAULT_LINK);
        assertThat(testAntiprocrastinationListTwo.getType()).isEqualTo(DEFAULT_TYPE);
        assertThat(testAntiprocrastinationListTwo.getDays()).isEqualTo(DEFAULT_DAYS);
        assertThat(testAntiprocrastinationListTwo.getHours()).isEqualTo(DEFAULT_HOURS);
        assertThat(testAntiprocrastinationListTwo.getMinutes()).isEqualTo(DEFAULT_MINUTES);
        assertThat(testAntiprocrastinationListTwo.getSeconds()).isEqualTo(DEFAULT_SECONDS);
        assertThat(testAntiprocrastinationListTwo.getEmpty()).isEqualTo(DEFAULT_EMPTY);
        assertThat(testAntiprocrastinationListTwo.getIdk()).isEqualTo(DEFAULT_IDK);
        assertThat(testAntiprocrastinationListTwo.getIdk1()).isEqualTo(DEFAULT_IDK_1);
        assertThat(testAntiprocrastinationListTwo.getDueDate()).isEqualTo(DEFAULT_DUE_DATE);
    }

    @Test
    @Transactional
    void createAntiprocrastinationListTwoWithExistingId() throws Exception {
        // Create the AntiprocrastinationListTwo with an existing ID
        antiprocrastinationListTwo.setId(1L);

        int databaseSizeBeforeCreate = antiprocrastinationListTwoRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAntiprocrastinationListTwoMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(antiprocrastinationListTwo))
            )
            .andExpect(status().isBadRequest());

        // Validate the AntiprocrastinationListTwo in the database
        List<AntiprocrastinationListTwo> antiprocrastinationListTwoList = antiprocrastinationListTwoRepository.findAll();
        assertThat(antiprocrastinationListTwoList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllAntiprocrastinationListTwos() throws Exception {
        // Initialize the database
        antiprocrastinationListTwoRepository.saveAndFlush(antiprocrastinationListTwo);

        // Get all the antiprocrastinationListTwoList
        restAntiprocrastinationListTwoMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(antiprocrastinationListTwo.getId().intValue())))
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

    @SuppressWarnings({ "unchecked" })
    void getAllAntiprocrastinationListTwosWithEagerRelationshipsIsEnabled() throws Exception {
        when(antiprocrastinationListTwoRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restAntiprocrastinationListTwoMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(antiprocrastinationListTwoRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllAntiprocrastinationListTwosWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(antiprocrastinationListTwoRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restAntiprocrastinationListTwoMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(antiprocrastinationListTwoRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getAntiprocrastinationListTwo() throws Exception {
        // Initialize the database
        antiprocrastinationListTwoRepository.saveAndFlush(antiprocrastinationListTwo);

        // Get the antiprocrastinationListTwo
        restAntiprocrastinationListTwoMockMvc
            .perform(get(ENTITY_API_URL_ID, antiprocrastinationListTwo.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(antiprocrastinationListTwo.getId().intValue()))
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
    void getNonExistingAntiprocrastinationListTwo() throws Exception {
        // Get the antiprocrastinationListTwo
        restAntiprocrastinationListTwoMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingAntiprocrastinationListTwo() throws Exception {
        // Initialize the database
        antiprocrastinationListTwoRepository.saveAndFlush(antiprocrastinationListTwo);

        int databaseSizeBeforeUpdate = antiprocrastinationListTwoRepository.findAll().size();

        // Update the antiprocrastinationListTwo
        AntiprocrastinationListTwo updatedAntiprocrastinationListTwo = antiprocrastinationListTwoRepository
            .findById(antiprocrastinationListTwo.getId())
            .get();
        // Disconnect from session so that the updates on updatedAntiprocrastinationListTwo are not directly saved in db
        em.detach(updatedAntiprocrastinationListTwo);
        updatedAntiprocrastinationListTwo
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

        restAntiprocrastinationListTwoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAntiprocrastinationListTwo.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedAntiprocrastinationListTwo))
            )
            .andExpect(status().isOk());

        // Validate the AntiprocrastinationListTwo in the database
        List<AntiprocrastinationListTwo> antiprocrastinationListTwoList = antiprocrastinationListTwoRepository.findAll();
        assertThat(antiprocrastinationListTwoList).hasSize(databaseSizeBeforeUpdate);
        AntiprocrastinationListTwo testAntiprocrastinationListTwo = antiprocrastinationListTwoList.get(
            antiprocrastinationListTwoList.size() - 1
        );
        assertThat(testAntiprocrastinationListTwo.getLink()).isEqualTo(UPDATED_LINK);
        assertThat(testAntiprocrastinationListTwo.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testAntiprocrastinationListTwo.getDays()).isEqualTo(UPDATED_DAYS);
        assertThat(testAntiprocrastinationListTwo.getHours()).isEqualTo(UPDATED_HOURS);
        assertThat(testAntiprocrastinationListTwo.getMinutes()).isEqualTo(UPDATED_MINUTES);
        assertThat(testAntiprocrastinationListTwo.getSeconds()).isEqualTo(UPDATED_SECONDS);
        assertThat(testAntiprocrastinationListTwo.getEmpty()).isEqualTo(UPDATED_EMPTY);
        assertThat(testAntiprocrastinationListTwo.getIdk()).isEqualTo(UPDATED_IDK);
        assertThat(testAntiprocrastinationListTwo.getIdk1()).isEqualTo(UPDATED_IDK_1);
        assertThat(testAntiprocrastinationListTwo.getDueDate()).isEqualTo(UPDATED_DUE_DATE);
    }

    @Test
    @Transactional
    void putNonExistingAntiprocrastinationListTwo() throws Exception {
        int databaseSizeBeforeUpdate = antiprocrastinationListTwoRepository.findAll().size();
        antiprocrastinationListTwo.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAntiprocrastinationListTwoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, antiprocrastinationListTwo.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(antiprocrastinationListTwo))
            )
            .andExpect(status().isBadRequest());

        // Validate the AntiprocrastinationListTwo in the database
        List<AntiprocrastinationListTwo> antiprocrastinationListTwoList = antiprocrastinationListTwoRepository.findAll();
        assertThat(antiprocrastinationListTwoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAntiprocrastinationListTwo() throws Exception {
        int databaseSizeBeforeUpdate = antiprocrastinationListTwoRepository.findAll().size();
        antiprocrastinationListTwo.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAntiprocrastinationListTwoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(antiprocrastinationListTwo))
            )
            .andExpect(status().isBadRequest());

        // Validate the AntiprocrastinationListTwo in the database
        List<AntiprocrastinationListTwo> antiprocrastinationListTwoList = antiprocrastinationListTwoRepository.findAll();
        assertThat(antiprocrastinationListTwoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAntiprocrastinationListTwo() throws Exception {
        int databaseSizeBeforeUpdate = antiprocrastinationListTwoRepository.findAll().size();
        antiprocrastinationListTwo.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAntiprocrastinationListTwoMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(antiprocrastinationListTwo))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the AntiprocrastinationListTwo in the database
        List<AntiprocrastinationListTwo> antiprocrastinationListTwoList = antiprocrastinationListTwoRepository.findAll();
        assertThat(antiprocrastinationListTwoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAntiprocrastinationListTwoWithPatch() throws Exception {
        // Initialize the database
        antiprocrastinationListTwoRepository.saveAndFlush(antiprocrastinationListTwo);

        int databaseSizeBeforeUpdate = antiprocrastinationListTwoRepository.findAll().size();

        // Update the antiprocrastinationListTwo using partial update
        AntiprocrastinationListTwo partialUpdatedAntiprocrastinationListTwo = new AntiprocrastinationListTwo();
        partialUpdatedAntiprocrastinationListTwo.setId(antiprocrastinationListTwo.getId());

        partialUpdatedAntiprocrastinationListTwo.days(UPDATED_DAYS).dueDate(UPDATED_DUE_DATE);

        restAntiprocrastinationListTwoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAntiprocrastinationListTwo.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAntiprocrastinationListTwo))
            )
            .andExpect(status().isOk());

        // Validate the AntiprocrastinationListTwo in the database
        List<AntiprocrastinationListTwo> antiprocrastinationListTwoList = antiprocrastinationListTwoRepository.findAll();
        assertThat(antiprocrastinationListTwoList).hasSize(databaseSizeBeforeUpdate);
        AntiprocrastinationListTwo testAntiprocrastinationListTwo = antiprocrastinationListTwoList.get(
            antiprocrastinationListTwoList.size() - 1
        );
        assertThat(testAntiprocrastinationListTwo.getLink()).isEqualTo(DEFAULT_LINK);
        assertThat(testAntiprocrastinationListTwo.getType()).isEqualTo(DEFAULT_TYPE);
        assertThat(testAntiprocrastinationListTwo.getDays()).isEqualTo(UPDATED_DAYS);
        assertThat(testAntiprocrastinationListTwo.getHours()).isEqualTo(DEFAULT_HOURS);
        assertThat(testAntiprocrastinationListTwo.getMinutes()).isEqualTo(DEFAULT_MINUTES);
        assertThat(testAntiprocrastinationListTwo.getSeconds()).isEqualTo(DEFAULT_SECONDS);
        assertThat(testAntiprocrastinationListTwo.getEmpty()).isEqualTo(DEFAULT_EMPTY);
        assertThat(testAntiprocrastinationListTwo.getIdk()).isEqualTo(DEFAULT_IDK);
        assertThat(testAntiprocrastinationListTwo.getIdk1()).isEqualTo(DEFAULT_IDK_1);
        assertThat(testAntiprocrastinationListTwo.getDueDate()).isEqualTo(UPDATED_DUE_DATE);
    }

    @Test
    @Transactional
    void fullUpdateAntiprocrastinationListTwoWithPatch() throws Exception {
        // Initialize the database
        antiprocrastinationListTwoRepository.saveAndFlush(antiprocrastinationListTwo);

        int databaseSizeBeforeUpdate = antiprocrastinationListTwoRepository.findAll().size();

        // Update the antiprocrastinationListTwo using partial update
        AntiprocrastinationListTwo partialUpdatedAntiprocrastinationListTwo = new AntiprocrastinationListTwo();
        partialUpdatedAntiprocrastinationListTwo.setId(antiprocrastinationListTwo.getId());

        partialUpdatedAntiprocrastinationListTwo
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

        restAntiprocrastinationListTwoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAntiprocrastinationListTwo.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAntiprocrastinationListTwo))
            )
            .andExpect(status().isOk());

        // Validate the AntiprocrastinationListTwo in the database
        List<AntiprocrastinationListTwo> antiprocrastinationListTwoList = antiprocrastinationListTwoRepository.findAll();
        assertThat(antiprocrastinationListTwoList).hasSize(databaseSizeBeforeUpdate);
        AntiprocrastinationListTwo testAntiprocrastinationListTwo = antiprocrastinationListTwoList.get(
            antiprocrastinationListTwoList.size() - 1
        );
        assertThat(testAntiprocrastinationListTwo.getLink()).isEqualTo(UPDATED_LINK);
        assertThat(testAntiprocrastinationListTwo.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testAntiprocrastinationListTwo.getDays()).isEqualTo(UPDATED_DAYS);
        assertThat(testAntiprocrastinationListTwo.getHours()).isEqualTo(UPDATED_HOURS);
        assertThat(testAntiprocrastinationListTwo.getMinutes()).isEqualTo(UPDATED_MINUTES);
        assertThat(testAntiprocrastinationListTwo.getSeconds()).isEqualTo(UPDATED_SECONDS);
        assertThat(testAntiprocrastinationListTwo.getEmpty()).isEqualTo(UPDATED_EMPTY);
        assertThat(testAntiprocrastinationListTwo.getIdk()).isEqualTo(UPDATED_IDK);
        assertThat(testAntiprocrastinationListTwo.getIdk1()).isEqualTo(UPDATED_IDK_1);
        assertThat(testAntiprocrastinationListTwo.getDueDate()).isEqualTo(UPDATED_DUE_DATE);
    }

    @Test
    @Transactional
    void patchNonExistingAntiprocrastinationListTwo() throws Exception {
        int databaseSizeBeforeUpdate = antiprocrastinationListTwoRepository.findAll().size();
        antiprocrastinationListTwo.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAntiprocrastinationListTwoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, antiprocrastinationListTwo.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(antiprocrastinationListTwo))
            )
            .andExpect(status().isBadRequest());

        // Validate the AntiprocrastinationListTwo in the database
        List<AntiprocrastinationListTwo> antiprocrastinationListTwoList = antiprocrastinationListTwoRepository.findAll();
        assertThat(antiprocrastinationListTwoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAntiprocrastinationListTwo() throws Exception {
        int databaseSizeBeforeUpdate = antiprocrastinationListTwoRepository.findAll().size();
        antiprocrastinationListTwo.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAntiprocrastinationListTwoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(antiprocrastinationListTwo))
            )
            .andExpect(status().isBadRequest());

        // Validate the AntiprocrastinationListTwo in the database
        List<AntiprocrastinationListTwo> antiprocrastinationListTwoList = antiprocrastinationListTwoRepository.findAll();
        assertThat(antiprocrastinationListTwoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAntiprocrastinationListTwo() throws Exception {
        int databaseSizeBeforeUpdate = antiprocrastinationListTwoRepository.findAll().size();
        antiprocrastinationListTwo.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAntiprocrastinationListTwoMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(antiprocrastinationListTwo))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the AntiprocrastinationListTwo in the database
        List<AntiprocrastinationListTwo> antiprocrastinationListTwoList = antiprocrastinationListTwoRepository.findAll();
        assertThat(antiprocrastinationListTwoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAntiprocrastinationListTwo() throws Exception {
        // Initialize the database
        antiprocrastinationListTwoRepository.saveAndFlush(antiprocrastinationListTwo);

        int databaseSizeBeforeDelete = antiprocrastinationListTwoRepository.findAll().size();

        // Delete the antiprocrastinationListTwo
        restAntiprocrastinationListTwoMockMvc
            .perform(delete(ENTITY_API_URL_ID, antiprocrastinationListTwo.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<AntiprocrastinationListTwo> antiprocrastinationListTwoList = antiprocrastinationListTwoRepository.findAll();
        assertThat(antiprocrastinationListTwoList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
