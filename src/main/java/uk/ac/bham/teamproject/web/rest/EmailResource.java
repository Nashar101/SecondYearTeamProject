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
import uk.ac.bham.teamproject.domain.Email;
import uk.ac.bham.teamproject.repository.EmailRepository;
import uk.ac.bham.teamproject.web.rest.errors.BadRequestAlertException;

/**
 * REST controller for managing {@link uk.ac.bham.teamproject.domain.Email}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class EmailResource {

    private final Logger log = LoggerFactory.getLogger(EmailResource.class);

    private static final String ENTITY_NAME = "email";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final EmailRepository emailRepository;

    public EmailResource(EmailRepository emailRepository) {
        this.emailRepository = emailRepository;
    }

    /**
     * {@code POST  /emails} : Create a new email.
     *
     * @param email the email to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new email, or with status {@code 400 (Bad Request)} if the email has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/emails")
    public ResponseEntity<Email> createEmail(@RequestBody Email email) throws URISyntaxException {
        log.debug("REST request to save Email : {}", email);
        if (email.getId() != null) {
            throw new BadRequestAlertException("A new email cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Email result = emailRepository.save(email);
        return ResponseEntity
            .created(new URI("/api/emails/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /emails/:id} : Updates an existing email.
     *
     * @param id the id of the email to save.
     * @param email the email to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated email,
     * or with status {@code 400 (Bad Request)} if the email is not valid,
     * or with status {@code 500 (Internal Server Error)} if the email couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/emails/{id}")
    public ResponseEntity<Email> updateEmail(@PathVariable(value = "id", required = false) final Long id, @RequestBody Email email)
        throws URISyntaxException {
        log.debug("REST request to update Email : {}, {}", id, email);
        if (email.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, email.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!emailRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Email result = emailRepository.save(email);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, email.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /emails/:id} : Partial updates given fields of an existing email, field will ignore if it is null
     *
     * @param id the id of the email to save.
     * @param email the email to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated email,
     * or with status {@code 400 (Bad Request)} if the email is not valid,
     * or with status {@code 404 (Not Found)} if the email is not found,
     * or with status {@code 500 (Internal Server Error)} if the email couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/emails/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Email> partialUpdateEmail(@PathVariable(value = "id", required = false) final Long id, @RequestBody Email email)
        throws URISyntaxException {
        log.debug("REST request to partial update Email partially : {}, {}", id, email);
        if (email.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, email.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!emailRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Email> result = emailRepository
            .findById(email.getId())
            .map(existingEmail -> {
                if (email.getSubject() != null) {
                    existingEmail.setSubject(email.getSubject());
                }
                if (email.getContent() != null) {
                    existingEmail.setContent(email.getContent());
                }
                if (email.getReceivedDate() != null) {
                    existingEmail.setReceivedDate(email.getReceivedDate());
                }
                if (email.getDeadline() != null) {
                    existingEmail.setDeadline(email.getDeadline());
                }
                if (email.getStatus() != null) {
                    existingEmail.setStatus(email.getStatus());
                }
                if (email.getRecipient() != null) {
                    existingEmail.setRecipient(email.getRecipient());
                }
                if (email.getRead() != null) {
                    existingEmail.setRead(email.getRead());
                }

                return existingEmail;
            })
            .map(emailRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, email.getId().toString())
        );
    }

    /**
     * {@code GET  /emails} : get all the emails.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of emails in body.
     */
    @GetMapping("/emails")
    public List<Email> getAllEmails(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all Emails");
        if (eagerload) {
            return emailRepository.findAllWithEagerRelationships();
        } else {
            return emailRepository.findAll();
        }
    }

    /**
     * {@code GET  /emails/:id} : get the "id" email.
     *
     * @param id the id of the email to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the email, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/emails/{id}")
    public ResponseEntity<Email> getEmail(@PathVariable Long id) {
        log.debug("REST request to get Email : {}", id);
        Optional<Email> email = emailRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(email);
    }

    /**
     * {@code DELETE  /emails/:id} : delete the "id" email.
     *
     * @param id the id of the email to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/emails/{id}")
    public ResponseEntity<Void> deleteEmail(@PathVariable Long id) {
        log.debug("REST request to delete Email : {}", id);
        emailRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
