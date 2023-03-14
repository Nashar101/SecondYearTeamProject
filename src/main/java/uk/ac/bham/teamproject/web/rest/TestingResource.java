package uk.ac.bham.teamproject.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;
import uk.ac.bham.teamproject.domain.Testing;
import uk.ac.bham.teamproject.repository.TestingRepository;
import uk.ac.bham.teamproject.web.rest.errors.BadRequestAlertException;

/**
 * REST controller for managing {@link uk.ac.bham.teamproject.domain.Testing}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class TestingResource {

    private final Logger log = LoggerFactory.getLogger(TestingResource.class);

    private static final String ENTITY_NAME = "testing";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final TestingRepository testingRepository;

    public TestingResource(TestingRepository testingRepository) {
        this.testingRepository = testingRepository;
    }

    /**
     * {@code POST  /testings} : Create a new testing.
     *
     * @param testing the testing to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new testing, or with status {@code 400 (Bad Request)} if the testing has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/testings")
    public ResponseEntity<Testing> createTesting(@Valid @RequestBody Testing testing) throws URISyntaxException {
        log.debug("REST request to save Testing : {}", testing);
        if (testing.getId() != null) {
            throw new BadRequestAlertException("A new testing cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Testing result = testingRepository.save(testing);
        return ResponseEntity
            .created(new URI("/api/testings/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /testings/:id} : Updates an existing testing.
     *
     * @param id the id of the testing to save.
     * @param testing the testing to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated testing,
     * or with status {@code 400 (Bad Request)} if the testing is not valid,
     * or with status {@code 500 (Internal Server Error)} if the testing couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/testings/{id}")
    public ResponseEntity<Testing> updateTesting(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Testing testing
    ) throws URISyntaxException {
        log.debug("REST request to update Testing : {}, {}", id, testing);
        if (testing.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, testing.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!testingRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Testing result = testingRepository.save(testing);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, testing.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /testings/:id} : Partial updates given fields of an existing testing, field will ignore if it is null
     *
     * @param id the id of the testing to save.
     * @param testing the testing to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated testing,
     * or with status {@code 400 (Bad Request)} if the testing is not valid,
     * or with status {@code 404 (Not Found)} if the testing is not found,
     * or with status {@code 500 (Internal Server Error)} if the testing couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/testings/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Testing> partialUpdateTesting(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Testing testing
    ) throws URISyntaxException {
        log.debug("REST request to partial update Testing partially : {}, {}", id, testing);
        if (testing.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, testing.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!testingRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Testing> result = testingRepository
            .findById(testing.getId())
            .map(existingTesting -> {
                if (testing.getSuwi() != null) {
                    existingTesting.setSuwi(testing.getSuwi());
                }

                return existingTesting;
            })
            .map(testingRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, testing.getId().toString())
        );
    }

    /**
     * {@code GET  /testings} : get all the testings.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of testings in body.
     */
    @GetMapping("/testings")
    public List<Testing> getAllTestings() {
        log.debug("REST request to get all Testings");
        return testingRepository.findAll();
    }

    /**
     * {@code GET  /testings/:id} : get the "id" testing.
     *
     * @param id the id of the testing to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the testing, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/testings/{id}")
    public ResponseEntity<Testing> getTesting(@PathVariable Long id) {
        log.debug("REST request to get Testing : {}", id);
        Optional<Testing> testing = testingRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(testing);
    }

    /**
     * {@code DELETE  /testings/:id} : delete the "id" testing.
     *
     * @param id the id of the testing to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/testings/{id}")
    public ResponseEntity<Void> deleteTesting(@PathVariable Long id) {
        log.debug("REST request to delete Testing : {}", id);
        testingRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
