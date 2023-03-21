package uk.ac.bham.teamproject.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;
import uk.ac.bham.teamproject.domain.AntiProcrastinationList;
import uk.ac.bham.teamproject.repository.AntiProcrastinationListRepository;
import uk.ac.bham.teamproject.web.rest.errors.BadRequestAlertException;

/**
 * REST controller for managing {@link uk.ac.bham.teamproject.domain.AntiProcrastinationList}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class AntiProcrastinationListResource {

    private final Logger log = LoggerFactory.getLogger(AntiProcrastinationListResource.class);

    private static final String ENTITY_NAME = "antiProcrastinationList";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final AntiProcrastinationListRepository antiProcrastinationListRepository;

    public AntiProcrastinationListResource(AntiProcrastinationListRepository antiProcrastinationListRepository) {
        this.antiProcrastinationListRepository = antiProcrastinationListRepository;
    }

    /**
     * {@code POST  /anti-procrastination-lists} : Create a new antiProcrastinationList.
     *
     * @param antiProcrastinationList the antiProcrastinationList to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new antiProcrastinationList, or with status {@code 400 (Bad Request)} if the antiProcrastinationList has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/anti-procrastination-lists")
    public ResponseEntity<AntiProcrastinationList> createAntiProcrastinationList(
        @RequestBody AntiProcrastinationList antiProcrastinationList
    ) throws URISyntaxException {
        log.debug("REST request to save AntiProcrastinationList : {}", antiProcrastinationList);
        if (antiProcrastinationList.getId() != null) {
            throw new BadRequestAlertException("A new antiProcrastinationList cannot already have an ID", ENTITY_NAME, "idexists");
        }
        AntiProcrastinationList result = antiProcrastinationListRepository.save(antiProcrastinationList);
        return ResponseEntity
            .created(new URI("/api/anti-procrastination-lists/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /anti-procrastination-lists/:id} : Updates an existing antiProcrastinationList.
     *
     * @param id the id of the antiProcrastinationList to save.
     * @param antiProcrastinationList the antiProcrastinationList to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated antiProcrastinationList,
     * or with status {@code 400 (Bad Request)} if the antiProcrastinationList is not valid,
     * or with status {@code 500 (Internal Server Error)} if the antiProcrastinationList couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/anti-procrastination-lists/{id}")
    public ResponseEntity<AntiProcrastinationList> updateAntiProcrastinationList(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody AntiProcrastinationList antiProcrastinationList
    ) throws URISyntaxException {
        log.debug("REST request to update AntiProcrastinationList : {}, {}", id, antiProcrastinationList);
        if (antiProcrastinationList.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, antiProcrastinationList.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!antiProcrastinationListRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        AntiProcrastinationList result = antiProcrastinationListRepository.save(antiProcrastinationList);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, antiProcrastinationList.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /anti-procrastination-lists/:id} : Partial updates given fields of an existing antiProcrastinationList, field will ignore if it is null
     *
     * @param id the id of the antiProcrastinationList to save.
     * @param antiProcrastinationList the antiProcrastinationList to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated antiProcrastinationList,
     * or with status {@code 400 (Bad Request)} if the antiProcrastinationList is not valid,
     * or with status {@code 404 (Not Found)} if the antiProcrastinationList is not found,
     * or with status {@code 500 (Internal Server Error)} if the antiProcrastinationList couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/anti-procrastination-lists/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<AntiProcrastinationList> partialUpdateAntiProcrastinationList(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody AntiProcrastinationList antiProcrastinationList
    ) throws URISyntaxException {
        log.debug("REST request to partial update AntiProcrastinationList partially : {}, {}", id, antiProcrastinationList);
        if (antiProcrastinationList.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, antiProcrastinationList.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!antiProcrastinationListRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<AntiProcrastinationList> result = antiProcrastinationListRepository
            .findById(antiProcrastinationList.getId())
            .map(existingAntiProcrastinationList -> {
                if (antiProcrastinationList.getLink() != null) {
                    existingAntiProcrastinationList.setLink(antiProcrastinationList.getLink());
                }
                if (antiProcrastinationList.getType() != null) {
                    existingAntiProcrastinationList.setType(antiProcrastinationList.getType());
                }
                if (antiProcrastinationList.getDays() != null) {
                    existingAntiProcrastinationList.setDays(antiProcrastinationList.getDays());
                }
                if (antiProcrastinationList.getHours() != null) {
                    existingAntiProcrastinationList.setHours(antiProcrastinationList.getHours());
                }
                if (antiProcrastinationList.getMinutes() != null) {
                    existingAntiProcrastinationList.setMinutes(antiProcrastinationList.getMinutes());
                }
                if (antiProcrastinationList.getSeconds() != null) {
                    existingAntiProcrastinationList.setSeconds(antiProcrastinationList.getSeconds());
                }
                if (antiProcrastinationList.getEmpty() != null) {
                    existingAntiProcrastinationList.setEmpty(antiProcrastinationList.getEmpty());
                }
                if (antiProcrastinationList.getIdk() != null) {
                    existingAntiProcrastinationList.setIdk(antiProcrastinationList.getIdk());
                }
                if (antiProcrastinationList.getIdk1() != null) {
                    existingAntiProcrastinationList.setIdk1(antiProcrastinationList.getIdk1());
                }
                if (antiProcrastinationList.getDueDate() != null) {
                    existingAntiProcrastinationList.setDueDate(antiProcrastinationList.getDueDate());
                }

                return existingAntiProcrastinationList;
            })
            .map(antiProcrastinationListRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, antiProcrastinationList.getId().toString())
        );
    }

    /**
     * {@code GET  /anti-procrastination-lists} : get all the antiProcrastinationLists.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of antiProcrastinationLists in body.
     */
    @GetMapping("/anti-procrastination-lists")
    public List<AntiProcrastinationList> getAllAntiProcrastinationLists() {
        log.debug("REST request to get all AntiProcrastinationLists");
        return antiProcrastinationListRepository.findAll();
    }

    /**
     * {@code GET  /anti-procrastination-lists/:id} : get the "id" antiProcrastinationList.
     *
     * @param id the id of the antiProcrastinationList to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the antiProcrastinationList, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/anti-procrastination-lists/{id}")
    public ResponseEntity<AntiProcrastinationList> getAntiProcrastinationList(@PathVariable Long id) {
        log.debug("REST request to get AntiProcrastinationList : {}", id);
        Optional<AntiProcrastinationList> antiProcrastinationList = antiProcrastinationListRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(antiProcrastinationList);
    }

    /**
     * {@code DELETE  /anti-procrastination-lists/:id} : delete the "id" antiProcrastinationList.
     *
     * @param id the id of the antiProcrastinationList to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/anti-procrastination-lists/{id}")
    public ResponseEntity<Void> deleteAntiProcrastinationList(@PathVariable Long id) {
        log.debug("REST request to delete AntiProcrastinationList : {}", id);
        antiProcrastinationListRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
