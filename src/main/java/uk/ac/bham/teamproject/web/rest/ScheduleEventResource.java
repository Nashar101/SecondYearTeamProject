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
import uk.ac.bham.teamproject.domain.ScheduleEvent;
import uk.ac.bham.teamproject.repository.ScheduleEventRepository;
import uk.ac.bham.teamproject.web.rest.errors.BadRequestAlertException;

/**
 * REST controller for managing {@link uk.ac.bham.teamproject.domain.ScheduleEvent}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ScheduleEventResource {

    private final Logger log = LoggerFactory.getLogger(ScheduleEventResource.class);

    private static final String ENTITY_NAME = "scheduleEvent";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ScheduleEventRepository scheduleEventRepository;

    public ScheduleEventResource(ScheduleEventRepository scheduleEventRepository) {
        this.scheduleEventRepository = scheduleEventRepository;
    }

    /**
     * {@code POST  /schedule-events} : Create a new scheduleEvent.
     *
     * @param scheduleEvent the scheduleEvent to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new scheduleEvent, or with status {@code 400 (Bad Request)} if the scheduleEvent has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/schedule-events")
    public ResponseEntity<ScheduleEvent> createScheduleEvent(@RequestBody ScheduleEvent scheduleEvent) throws URISyntaxException {
        log.debug("REST request to save ScheduleEvent : {}", scheduleEvent);
        if (scheduleEvent.getId() != null) {
            throw new BadRequestAlertException("A new scheduleEvent cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ScheduleEvent result = scheduleEventRepository.save(scheduleEvent);
        return ResponseEntity
            .created(new URI("/api/schedule-events/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /schedule-events/:id} : Updates an existing scheduleEvent.
     *
     * @param id the id of the scheduleEvent to save.
     * @param scheduleEvent the scheduleEvent to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated scheduleEvent,
     * or with status {@code 400 (Bad Request)} if the scheduleEvent is not valid,
     * or with status {@code 500 (Internal Server Error)} if the scheduleEvent couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/schedule-events/{id}")
    public ResponseEntity<ScheduleEvent> updateScheduleEvent(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ScheduleEvent scheduleEvent
    ) throws URISyntaxException {
        log.debug("REST request to update ScheduleEvent : {}, {}", id, scheduleEvent);
        if (scheduleEvent.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, scheduleEvent.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!scheduleEventRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ScheduleEvent result = scheduleEventRepository.save(scheduleEvent);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, scheduleEvent.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /schedule-events/:id} : Partial updates given fields of an existing scheduleEvent, field will ignore if it is null
     *
     * @param id the id of the scheduleEvent to save.
     * @param scheduleEvent the scheduleEvent to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated scheduleEvent,
     * or with status {@code 400 (Bad Request)} if the scheduleEvent is not valid,
     * or with status {@code 404 (Not Found)} if the scheduleEvent is not found,
     * or with status {@code 500 (Internal Server Error)} if the scheduleEvent couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/schedule-events/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ScheduleEvent> partialUpdateScheduleEvent(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ScheduleEvent scheduleEvent
    ) throws URISyntaxException {
        log.debug("REST request to partial update ScheduleEvent partially : {}, {}", id, scheduleEvent);
        if (scheduleEvent.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, scheduleEvent.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!scheduleEventRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ScheduleEvent> result = scheduleEventRepository
            .findById(scheduleEvent.getId())
            .map(existingScheduleEvent -> {
                if (scheduleEvent.getStartTime() != null) {
                    existingScheduleEvent.setStartTime(scheduleEvent.getStartTime());
                }
                if (scheduleEvent.getEndTime() != null) {
                    existingScheduleEvent.setEndTime(scheduleEvent.getEndTime());
                }
                if (scheduleEvent.getHeading() != null) {
                    existingScheduleEvent.setHeading(scheduleEvent.getHeading());
                }
                if (scheduleEvent.getDate() != null) {
                    existingScheduleEvent.setDate(scheduleEvent.getDate());
                }
                if (scheduleEvent.getDetails() != null) {
                    existingScheduleEvent.setDetails(scheduleEvent.getDetails());
                }

                return existingScheduleEvent;
            })
            .map(scheduleEventRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, scheduleEvent.getId().toString())
        );
    }

    /**
     * {@code GET  /schedule-events} : get all the scheduleEvents.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of scheduleEvents in body.
     */
    @GetMapping("/schedule-events")
    public List<ScheduleEvent> getAllScheduleEvents(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all ScheduleEvents");
        if (eagerload) {
            return scheduleEventRepository.findAllWithEagerRelationships();
        } else {
            return scheduleEventRepository.findAll();
        }
    }

    /**
     * {@code GET  /schedule-events/:id} : get the "id" scheduleEvent.
     *
     * @param id the id of the scheduleEvent to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the scheduleEvent, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/schedule-events/{id}")
    public ResponseEntity<ScheduleEvent> getScheduleEvent(@PathVariable Long id) {
        log.debug("REST request to get ScheduleEvent : {}", id);
        Optional<ScheduleEvent> scheduleEvent = scheduleEventRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(scheduleEvent);
    }

    /**
     * {@code DELETE  /schedule-events/:id} : delete the "id" scheduleEvent.
     *
     * @param id the id of the scheduleEvent to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/schedule-events/{id}")
    public ResponseEntity<Void> deleteScheduleEvent(@PathVariable Long id) {
        log.debug("REST request to delete ScheduleEvent : {}", id);
        scheduleEventRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
