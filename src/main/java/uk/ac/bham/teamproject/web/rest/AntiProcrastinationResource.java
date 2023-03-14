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
import uk.ac.bham.teamproject.domain.AntiProcrastination;
import uk.ac.bham.teamproject.repository.AntiProcrastinationRepository;
import uk.ac.bham.teamproject.web.rest.errors.BadRequestAlertException;

/**
 * REST controller for managing {@link uk.ac.bham.teamproject.domain.AntiProcrastination}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class AntiProcrastinationResource {

    private final Logger log = LoggerFactory.getLogger(AntiProcrastinationResource.class);

    private static final String ENTITY_NAME = "antiProcrastination";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final AntiProcrastinationRepository antiProcrastinationRepository;

    public AntiProcrastinationResource(AntiProcrastinationRepository antiProcrastinationRepository) {
        this.antiProcrastinationRepository = antiProcrastinationRepository;
    }

    /**
     * {@code POST  /anti-procrastinations} : Create a new antiProcrastination.
     *
     * @param antiProcrastination the antiProcrastination to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new antiProcrastination, or with status {@code 400 (Bad Request)} if the antiProcrastination has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/anti-procrastinations")
    public ResponseEntity<AntiProcrastination> createAntiProcrastination(@Valid @RequestBody AntiProcrastination antiProcrastination)
        throws URISyntaxException {
        log.debug("REST request to save AntiProcrastination : {}", antiProcrastination);
        if (antiProcrastination.getId() != null) {
            throw new BadRequestAlertException("A new antiProcrastination cannot already have an ID", ENTITY_NAME, "idexists");
        }
        AntiProcrastination result = antiProcrastinationRepository.save(antiProcrastination);
        return ResponseEntity
            .created(new URI("/api/anti-procrastinations/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /anti-procrastinations/:id} : Updates an existing antiProcrastination.
     *
     * @param id the id of the antiProcrastination to save.
     * @param antiProcrastination the antiProcrastination to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated antiProcrastination,
     * or with status {@code 400 (Bad Request)} if the antiProcrastination is not valid,
     * or with status {@code 500 (Internal Server Error)} if the antiProcrastination couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/anti-procrastinations/{id}")
    public ResponseEntity<AntiProcrastination> updateAntiProcrastination(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody AntiProcrastination antiProcrastination
    ) throws URISyntaxException {
        log.debug("REST request to update AntiProcrastination : {}, {}", id, antiProcrastination);
        if (antiProcrastination.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, antiProcrastination.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!antiProcrastinationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        AntiProcrastination result = antiProcrastinationRepository.save(antiProcrastination);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, antiProcrastination.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /anti-procrastinations/:id} : Partial updates given fields of an existing antiProcrastination, field will ignore if it is null
     *
     * @param id the id of the antiProcrastination to save.
     * @param antiProcrastination the antiProcrastination to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated antiProcrastination,
     * or with status {@code 400 (Bad Request)} if the antiProcrastination is not valid,
     * or with status {@code 404 (Not Found)} if the antiProcrastination is not found,
     * or with status {@code 500 (Internal Server Error)} if the antiProcrastination couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/anti-procrastinations/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<AntiProcrastination> partialUpdateAntiProcrastination(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody AntiProcrastination antiProcrastination
    ) throws URISyntaxException {
        log.debug("REST request to partial update AntiProcrastination partially : {}, {}", id, antiProcrastination);
        if (antiProcrastination.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, antiProcrastination.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!antiProcrastinationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<AntiProcrastination> result = antiProcrastinationRepository
            .findById(antiProcrastination.getId())
            .map(existingAntiProcrastination -> {
                if (antiProcrastination.getUrl() != null) {
                    existingAntiProcrastination.setUrl(antiProcrastination.getUrl());
                }
                if (antiProcrastination.getType() != null) {
                    existingAntiProcrastination.setType(antiProcrastination.getType());
                }
                if (antiProcrastination.getDays() != null) {
                    existingAntiProcrastination.setDays(antiProcrastination.getDays());
                }
                if (antiProcrastination.getHours() != null) {
                    existingAntiProcrastination.setHours(antiProcrastination.getHours());
                }
                if (antiProcrastination.getMinutes() != null) {
                    existingAntiProcrastination.setMinutes(antiProcrastination.getMinutes());
                }
                if (antiProcrastination.getSeconds() != null) {
                    existingAntiProcrastination.setSeconds(antiProcrastination.getSeconds());
                }

                return existingAntiProcrastination;
            })
            .map(antiProcrastinationRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, antiProcrastination.getId().toString())
        );
    }

    /**
     * {@code GET  /anti-procrastinations} : get all the antiProcrastinations.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of antiProcrastinations in body.
     */
    @GetMapping("/anti-procrastinations")
    public List<AntiProcrastination> getAllAntiProcrastinations() {
        log.debug("REST request to get all AntiProcrastinations");
        return antiProcrastinationRepository.findAll();
    }

    /**
     * {@code GET  /anti-procrastinations/:id} : get the "id" antiProcrastination.
     *
     * @param id the id of the antiProcrastination to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the antiProcrastination, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/anti-procrastinations/{id}")
    public ResponseEntity<AntiProcrastination> getAntiProcrastination(@PathVariable Long id) {
        log.debug("REST request to get AntiProcrastination : {}", id);
        Optional<AntiProcrastination> antiProcrastination = antiProcrastinationRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(antiProcrastination);
    }

    /**
     * {@code DELETE  /anti-procrastinations/:id} : delete the "id" antiProcrastination.
     *
     * @param id the id of the antiProcrastination to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/anti-procrastinations/{id}")
    public ResponseEntity<Void> deleteAntiProcrastination(@PathVariable Long id) {
        log.debug("REST request to delete AntiProcrastination : {}", id);
        antiProcrastinationRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
