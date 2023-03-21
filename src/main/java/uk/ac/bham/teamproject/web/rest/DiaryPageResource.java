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
import uk.ac.bham.teamproject.domain.DiaryPage;
import uk.ac.bham.teamproject.repository.DiaryPageRepository;
import uk.ac.bham.teamproject.web.rest.errors.BadRequestAlertException;

/**
 * REST controller for managing {@link uk.ac.bham.teamproject.domain.DiaryPage}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class DiaryPageResource {

    private final Logger log = LoggerFactory.getLogger(DiaryPageResource.class);

    private static final String ENTITY_NAME = "diaryPage";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final DiaryPageRepository diaryPageRepository;

    public DiaryPageResource(DiaryPageRepository diaryPageRepository) {
        this.diaryPageRepository = diaryPageRepository;
    }

    /**
     * {@code POST  /diary-pages} : Create a new diaryPage.
     *
     * @param diaryPage the diaryPage to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new diaryPage, or with status {@code 400 (Bad Request)} if the diaryPage has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/diary-pages")
    public ResponseEntity<DiaryPage> createDiaryPage(@Valid @RequestBody DiaryPage diaryPage) throws URISyntaxException {
        log.debug("REST request to save DiaryPage : {}", diaryPage);
        if (diaryPage.getId() != null) {
            throw new BadRequestAlertException("A new diaryPage cannot already have an ID", ENTITY_NAME, "idexists");
        }
        DiaryPage result = diaryPageRepository.save(diaryPage);
        return ResponseEntity
            .created(new URI("/api/diary-pages/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /diary-pages/:id} : Updates an existing diaryPage.
     *
     * @param id the id of the diaryPage to save.
     * @param diaryPage the diaryPage to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated diaryPage,
     * or with status {@code 400 (Bad Request)} if the diaryPage is not valid,
     * or with status {@code 500 (Internal Server Error)} if the diaryPage couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/diary-pages/{id}")
    public ResponseEntity<DiaryPage> updateDiaryPage(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody DiaryPage diaryPage
    ) throws URISyntaxException {
        log.debug("REST request to update DiaryPage : {}, {}", id, diaryPage);
        if (diaryPage.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, diaryPage.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!diaryPageRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        DiaryPage result = diaryPageRepository.save(diaryPage);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, diaryPage.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /diary-pages/:id} : Partial updates given fields of an existing diaryPage, field will ignore if it is null
     *
     * @param id the id of the diaryPage to save.
     * @param diaryPage the diaryPage to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated diaryPage,
     * or with status {@code 400 (Bad Request)} if the diaryPage is not valid,
     * or with status {@code 404 (Not Found)} if the diaryPage is not found,
     * or with status {@code 500 (Internal Server Error)} if the diaryPage couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/diary-pages/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<DiaryPage> partialUpdateDiaryPage(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody DiaryPage diaryPage
    ) throws URISyntaxException {
        log.debug("REST request to partial update DiaryPage partially : {}, {}", id, diaryPage);
        if (diaryPage.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, diaryPage.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!diaryPageRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<DiaryPage> result = diaryPageRepository
            .findById(diaryPage.getId())
            .map(existingDiaryPage -> {
                if (diaryPage.getPageDate() != null) {
                    existingDiaryPage.setPageDate(diaryPage.getPageDate());
                }
                if (diaryPage.getPageDescription() != null) {
                    existingDiaryPage.setPageDescription(diaryPage.getPageDescription());
                }
                if (diaryPage.getCreationTime() != null) {
                    existingDiaryPage.setCreationTime(diaryPage.getCreationTime());
                }
                if (diaryPage.getLastEditTime() != null) {
                    existingDiaryPage.setLastEditTime(diaryPage.getLastEditTime());
                }

                return existingDiaryPage;
            })
            .map(diaryPageRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, diaryPage.getId().toString())
        );
    }

    /**
     * {@code GET  /diary-pages} : get all the diaryPages.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of diaryPages in body.
     */
    @GetMapping("/diary-pages")
    public List<DiaryPage> getAllDiaryPages(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all DiaryPages");
        if (eagerload) {
            return diaryPageRepository.findAllWithEagerRelationships();
        } else {
            return diaryPageRepository.findAll();
        }
    }

    /**
     * {@code GET  /diary-pages/:id} : get the "id" diaryPage.
     *
     * @param id the id of the diaryPage to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the diaryPage, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/diary-pages/{id}")
    public ResponseEntity<DiaryPage> getDiaryPage(@PathVariable Long id) {
        log.debug("REST request to get DiaryPage : {}", id);
        Optional<DiaryPage> diaryPage = diaryPageRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(diaryPage);
    }

    /**
     * {@code DELETE  /diary-pages/:id} : delete the "id" diaryPage.
     *
     * @param id the id of the diaryPage to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/diary-pages/{id}")
    public ResponseEntity<Void> deleteDiaryPage(@PathVariable Long id) {
        log.debug("REST request to delete DiaryPage : {}", id);
        diaryPageRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
