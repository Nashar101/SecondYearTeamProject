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
import uk.ac.bham.teamproject.domain.AntiprocrastinationListTwo;
import uk.ac.bham.teamproject.repository.AntiprocrastinationListTwoRepository;
import uk.ac.bham.teamproject.web.rest.errors.BadRequestAlertException;

/**
 * REST controller for managing {@link uk.ac.bham.teamproject.domain.AntiprocrastinationListTwo}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class AntiprocrastinationListTwoResource {

    private final Logger log = LoggerFactory.getLogger(AntiprocrastinationListTwoResource.class);

    private static final String ENTITY_NAME = "antiprocrastinationListTwo";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final AntiprocrastinationListTwoRepository antiprocrastinationListTwoRepository;

    public AntiprocrastinationListTwoResource(AntiprocrastinationListTwoRepository antiprocrastinationListTwoRepository) {
        this.antiprocrastinationListTwoRepository = antiprocrastinationListTwoRepository;
    }

    /**
     * {@code POST  /antiprocrastination-list-twos} : Create a new antiprocrastinationListTwo.
     *
     * @param antiprocrastinationListTwo the antiprocrastinationListTwo to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new antiprocrastinationListTwo, or with status {@code 400 (Bad Request)} if the antiprocrastinationListTwo has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/antiprocrastination-list-twos")
    public ResponseEntity<AntiprocrastinationListTwo> createAntiprocrastinationListTwo(
        @RequestBody AntiprocrastinationListTwo antiprocrastinationListTwo
    ) throws URISyntaxException {
        log.debug("REST request to save AntiprocrastinationListTwo : {}", antiprocrastinationListTwo);
        if (antiprocrastinationListTwo.getId() != null) {
            throw new BadRequestAlertException("A new antiprocrastinationListTwo cannot already have an ID", ENTITY_NAME, "idexists");
        }
        AntiprocrastinationListTwo result = antiprocrastinationListTwoRepository.save(antiprocrastinationListTwo);
        return ResponseEntity
            .created(new URI("/api/antiprocrastination-list-twos/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /antiprocrastination-list-twos/:id} : Updates an existing antiprocrastinationListTwo.
     *
     * @param id the id of the antiprocrastinationListTwo to save.
     * @param antiprocrastinationListTwo the antiprocrastinationListTwo to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated antiprocrastinationListTwo,
     * or with status {@code 400 (Bad Request)} if the antiprocrastinationListTwo is not valid,
     * or with status {@code 500 (Internal Server Error)} if the antiprocrastinationListTwo couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/antiprocrastination-list-twos/{id}")
    public ResponseEntity<AntiprocrastinationListTwo> updateAntiprocrastinationListTwo(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody AntiprocrastinationListTwo antiprocrastinationListTwo
    ) throws URISyntaxException {
        log.debug("REST request to update AntiprocrastinationListTwo : {}, {}", id, antiprocrastinationListTwo);
        if (antiprocrastinationListTwo.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, antiprocrastinationListTwo.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!antiprocrastinationListTwoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        AntiprocrastinationListTwo result = antiprocrastinationListTwoRepository.save(antiprocrastinationListTwo);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, antiprocrastinationListTwo.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /antiprocrastination-list-twos/:id} : Partial updates given fields of an existing antiprocrastinationListTwo, field will ignore if it is null
     *
     * @param id the id of the antiprocrastinationListTwo to save.
     * @param antiprocrastinationListTwo the antiprocrastinationListTwo to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated antiprocrastinationListTwo,
     * or with status {@code 400 (Bad Request)} if the antiprocrastinationListTwo is not valid,
     * or with status {@code 404 (Not Found)} if the antiprocrastinationListTwo is not found,
     * or with status {@code 500 (Internal Server Error)} if the antiprocrastinationListTwo couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/antiprocrastination-list-twos/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<AntiprocrastinationListTwo> partialUpdateAntiprocrastinationListTwo(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody AntiprocrastinationListTwo antiprocrastinationListTwo
    ) throws URISyntaxException {
        log.debug("REST request to partial update AntiprocrastinationListTwo partially : {}, {}", id, antiprocrastinationListTwo);
        if (antiprocrastinationListTwo.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, antiprocrastinationListTwo.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!antiprocrastinationListTwoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<AntiprocrastinationListTwo> result = antiprocrastinationListTwoRepository
            .findById(antiprocrastinationListTwo.getId())
            .map(existingAntiprocrastinationListTwo -> {
                if (antiprocrastinationListTwo.getLink() != null) {
                    existingAntiprocrastinationListTwo.setLink(antiprocrastinationListTwo.getLink());
                }
                if (antiprocrastinationListTwo.getType() != null) {
                    existingAntiprocrastinationListTwo.setType(antiprocrastinationListTwo.getType());
                }
                if (antiprocrastinationListTwo.getDays() != null) {
                    existingAntiprocrastinationListTwo.setDays(antiprocrastinationListTwo.getDays());
                }
                if (antiprocrastinationListTwo.getHours() != null) {
                    existingAntiprocrastinationListTwo.setHours(antiprocrastinationListTwo.getHours());
                }
                if (antiprocrastinationListTwo.getMinutes() != null) {
                    existingAntiprocrastinationListTwo.setMinutes(antiprocrastinationListTwo.getMinutes());
                }
                if (antiprocrastinationListTwo.getSeconds() != null) {
                    existingAntiprocrastinationListTwo.setSeconds(antiprocrastinationListTwo.getSeconds());
                }
                if (antiprocrastinationListTwo.getEmpty() != null) {
                    existingAntiprocrastinationListTwo.setEmpty(antiprocrastinationListTwo.getEmpty());
                }
                if (antiprocrastinationListTwo.getIdk() != null) {
                    existingAntiprocrastinationListTwo.setIdk(antiprocrastinationListTwo.getIdk());
                }
                if (antiprocrastinationListTwo.getIdk1() != null) {
                    existingAntiprocrastinationListTwo.setIdk1(antiprocrastinationListTwo.getIdk1());
                }
                if (antiprocrastinationListTwo.getDueDate() != null) {
                    existingAntiprocrastinationListTwo.setDueDate(antiprocrastinationListTwo.getDueDate());
                }

                return existingAntiprocrastinationListTwo;
            })
            .map(antiprocrastinationListTwoRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, antiprocrastinationListTwo.getId().toString())
        );
    }

    /**
     * {@code GET  /antiprocrastination-list-twos} : get all the antiprocrastinationListTwos.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of antiprocrastinationListTwos in body.
     */
    @GetMapping("/antiprocrastination-list-twos")
    public List<AntiprocrastinationListTwo> getAllAntiprocrastinationListTwos(
        @RequestParam(required = false, defaultValue = "false") boolean eagerload
    ) {
        log.debug("REST request to get all AntiprocrastinationListTwos");
        if (eagerload) {
            return antiprocrastinationListTwoRepository.findAllWithEagerRelationships();
        } else {
            return antiprocrastinationListTwoRepository.findAll();
        }
    }

    /**
     * {@code GET  /antiprocrastination-list-twos/:id} : get the "id" antiprocrastinationListTwo.
     *
     * @param id the id of the antiprocrastinationListTwo to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the antiprocrastinationListTwo, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/antiprocrastination-list-twos/{id}")
    public ResponseEntity<AntiprocrastinationListTwo> getAntiprocrastinationListTwo(@PathVariable Long id) {
        log.debug("REST request to get AntiprocrastinationListTwo : {}", id);
        Optional<AntiprocrastinationListTwo> antiprocrastinationListTwo = antiprocrastinationListTwoRepository.findOneWithEagerRelationships(
            id
        );
        return ResponseUtil.wrapOrNotFound(antiprocrastinationListTwo);
    }

    /**
     * {@code DELETE  /antiprocrastination-list-twos/:id} : delete the "id" antiprocrastinationListTwo.
     *
     * @param id the id of the antiprocrastinationListTwo to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/antiprocrastination-list-twos/{id}")
    public ResponseEntity<Void> deleteAntiprocrastinationListTwo(@PathVariable Long id) {
        log.debug("REST request to delete AntiprocrastinationListTwo : {}", id);
        antiprocrastinationListTwoRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
