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
import uk.ac.bham.teamproject.domain.ExtensionID;
import uk.ac.bham.teamproject.repository.ExtensionIDRepository;
import uk.ac.bham.teamproject.web.rest.errors.BadRequestAlertException;

/**
 * REST controller for managing {@link uk.ac.bham.teamproject.domain.ExtensionID}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ExtensionIDResource {

    private final Logger log = LoggerFactory.getLogger(ExtensionIDResource.class);

    private static final String ENTITY_NAME = "extensionID";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ExtensionIDRepository extensionIDRepository;

    public ExtensionIDResource(ExtensionIDRepository extensionIDRepository) {
        this.extensionIDRepository = extensionIDRepository;
    }

    /**
     * {@code POST  /extension-ids} : Create a new extensionID.
     *
     * @param extensionID the extensionID to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new extensionID, or with status {@code 400 (Bad Request)} if the extensionID has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/extension-ids")
    public ResponseEntity<ExtensionID> createExtensionID(@RequestBody ExtensionID extensionID) throws URISyntaxException {
        log.debug("REST request to save ExtensionID : {}", extensionID);
        if (extensionID.getId() != null) {
            throw new BadRequestAlertException("A new extensionID cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ExtensionID result = extensionIDRepository.save(extensionID);
        return ResponseEntity
            .created(new URI("/api/extension-ids/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /extension-ids/:id} : Updates an existing extensionID.
     *
     * @param id the id of the extensionID to save.
     * @param extensionID the extensionID to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated extensionID,
     * or with status {@code 400 (Bad Request)} if the extensionID is not valid,
     * or with status {@code 500 (Internal Server Error)} if the extensionID couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/extension-ids/{id}")
    public ResponseEntity<ExtensionID> updateExtensionID(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ExtensionID extensionID
    ) throws URISyntaxException {
        log.debug("REST request to update ExtensionID : {}, {}", id, extensionID);
        if (extensionID.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, extensionID.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!extensionIDRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ExtensionID result = extensionIDRepository.save(extensionID);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, extensionID.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /extension-ids/:id} : Partial updates given fields of an existing extensionID, field will ignore if it is null
     *
     * @param id the id of the extensionID to save.
     * @param extensionID the extensionID to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated extensionID,
     * or with status {@code 400 (Bad Request)} if the extensionID is not valid,
     * or with status {@code 404 (Not Found)} if the extensionID is not found,
     * or with status {@code 500 (Internal Server Error)} if the extensionID couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/extension-ids/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ExtensionID> partialUpdateExtensionID(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ExtensionID extensionID
    ) throws URISyntaxException {
        log.debug("REST request to partial update ExtensionID partially : {}, {}", id, extensionID);
        if (extensionID.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, extensionID.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!extensionIDRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ExtensionID> result = extensionIDRepository
            .findById(extensionID.getId())
            .map(existingExtensionID -> {
                if (extensionID.getExtensionID() != null) {
                    existingExtensionID.setExtensionID(extensionID.getExtensionID());
                }

                return existingExtensionID;
            })
            .map(extensionIDRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, extensionID.getId().toString())
        );
    }

    /**
     * {@code GET  /extension-ids} : get all the extensionIDS.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of extensionIDS in body.
     */
    @GetMapping("/extension-ids")
    public List<ExtensionID> getAllExtensionIDS(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all ExtensionIDS");
        if (eagerload) {
            return extensionIDRepository.findAllWithEagerRelationships();
        } else {
            return extensionIDRepository.findAll();
        }
    }

    /**
     * {@code GET  /extension-ids/:id} : get the "id" extensionID.
     *
     * @param id the id of the extensionID to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the extensionID, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/extension-ids/{id}")
    public ResponseEntity<ExtensionID> getExtensionID(@PathVariable Long id) {
        log.debug("REST request to get ExtensionID : {}", id);
        Optional<ExtensionID> extensionID = extensionIDRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(extensionID);
    }

    /**
     * {@code DELETE  /extension-ids/:id} : delete the "id" extensionID.
     *
     * @param id the id of the extensionID to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/extension-ids/{id}")
    public ResponseEntity<Void> deleteExtensionID(@PathVariable Long id) {
        log.debug("REST request to delete ExtensionID : {}", id);
        extensionIDRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
