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
import uk.ac.bham.teamproject.domain.HistoryTwo;
import uk.ac.bham.teamproject.repository.HistoryTwoRepository;
import uk.ac.bham.teamproject.web.rest.errors.BadRequestAlertException;

/**
 * REST controller for managing {@link uk.ac.bham.teamproject.domain.HistoryTwo}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class HistoryTwoResource {

    private final Logger log = LoggerFactory.getLogger(HistoryTwoResource.class);

    private static final String ENTITY_NAME = "historyTwo";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final HistoryTwoRepository historyTwoRepository;

    public HistoryTwoResource(HistoryTwoRepository historyTwoRepository) {
        this.historyTwoRepository = historyTwoRepository;
    }

    /**
     * {@code POST  /history-twos} : Create a new historyTwo.
     *
     * @param historyTwo the historyTwo to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new historyTwo, or with status {@code 400 (Bad Request)} if the historyTwo has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/history-twos")
    public ResponseEntity<HistoryTwo> createHistoryTwo(@RequestBody HistoryTwo historyTwo) throws URISyntaxException {
        log.debug("REST request to save HistoryTwo : {}", historyTwo);
        if (historyTwo.getId() != null) {
            throw new BadRequestAlertException("A new historyTwo cannot already have an ID", ENTITY_NAME, "idexists");
        }
        HistoryTwo result = historyTwoRepository.save(historyTwo);
        return ResponseEntity
            .created(new URI("/api/history-twos/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /history-twos/:id} : Updates an existing historyTwo.
     *
     * @param id the id of the historyTwo to save.
     * @param historyTwo the historyTwo to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated historyTwo,
     * or with status {@code 400 (Bad Request)} if the historyTwo is not valid,
     * or with status {@code 500 (Internal Server Error)} if the historyTwo couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/history-twos/{id}")
    public ResponseEntity<HistoryTwo> updateHistoryTwo(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody HistoryTwo historyTwo
    ) throws URISyntaxException {
        log.debug("REST request to update HistoryTwo : {}, {}", id, historyTwo);
        if (historyTwo.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, historyTwo.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!historyTwoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        HistoryTwo result = historyTwoRepository.save(historyTwo);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, historyTwo.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /history-twos/:id} : Partial updates given fields of an existing historyTwo, field will ignore if it is null
     *
     * @param id the id of the historyTwo to save.
     * @param historyTwo the historyTwo to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated historyTwo,
     * or with status {@code 400 (Bad Request)} if the historyTwo is not valid,
     * or with status {@code 404 (Not Found)} if the historyTwo is not found,
     * or with status {@code 500 (Internal Server Error)} if the historyTwo couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/history-twos/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<HistoryTwo> partialUpdateHistoryTwo(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody HistoryTwo historyTwo
    ) throws URISyntaxException {
        log.debug("REST request to partial update HistoryTwo partially : {}, {}", id, historyTwo);
        if (historyTwo.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, historyTwo.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!historyTwoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<HistoryTwo> result = historyTwoRepository
            .findById(historyTwo.getId())
            .map(existingHistoryTwo -> {
                if (historyTwo.getSubject() != null) {
                    existingHistoryTwo.setSubject(historyTwo.getSubject());
                }
                if (historyTwo.getSubjectScore() != null) {
                    existingHistoryTwo.setSubjectScore(historyTwo.getSubjectScore());
                }
                if (historyTwo.getSubjectTarget() != null) {
                    existingHistoryTwo.setSubjectTarget(historyTwo.getSubjectTarget());
                }
                if (historyTwo.getUpcomingTest() != null) {
                    existingHistoryTwo.setUpcomingTest(historyTwo.getUpcomingTest());
                }
                if (historyTwo.getUpcomingTestTarget() != null) {
                    existingHistoryTwo.setUpcomingTestTarget(historyTwo.getUpcomingTestTarget());
                }

                return existingHistoryTwo;
            })
            .map(historyTwoRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, historyTwo.getId().toString())
        );
    }

    /**
     * {@code GET  /history-twos} : get all the historyTwos.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of historyTwos in body.
     */
    @GetMapping("/history-twos")
    public List<HistoryTwo> getAllHistoryTwos(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all HistoryTwos");
        if (eagerload) {
            return historyTwoRepository.findAllWithEagerRelationships();
        } else {
            return historyTwoRepository.findAll();
        }
    }

    /**
     * {@code GET  /history-twos/:id} : get the "id" historyTwo.
     *
     * @param id the id of the historyTwo to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the historyTwo, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/history-twos/{id}")
    public ResponseEntity<HistoryTwo> getHistoryTwo(@PathVariable Long id) {
        log.debug("REST request to get HistoryTwo : {}", id);
        Optional<HistoryTwo> historyTwo = historyTwoRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(historyTwo);
    }

    /**
     * {@code DELETE  /history-twos/:id} : delete the "id" historyTwo.
     *
     * @param id the id of the historyTwo to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/history-twos/{id}")
    public ResponseEntity<Void> deleteHistoryTwo(@PathVariable Long id) {
        log.debug("REST request to delete HistoryTwo : {}", id);
        historyTwoRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
