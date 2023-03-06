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
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;
import uk.ac.bham.teamproject.domain.TodolistItem;
import uk.ac.bham.teamproject.repository.TodolistItemRepository;
import uk.ac.bham.teamproject.web.rest.errors.BadRequestAlertException;

/**
 * REST controller for managing {@link uk.ac.bham.teamproject.domain.TodolistItem}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class TodolistItemResource {

    private final Logger log = LoggerFactory.getLogger(TodolistItemResource.class);

    private static final String ENTITY_NAME = "todolistItem";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final TodolistItemRepository todolistItemRepository;

    public TodolistItemResource(TodolistItemRepository todolistItemRepository) {
        this.todolistItemRepository = todolistItemRepository;
    }

    /**
     * {@code POST  /todolist-items} : Create a new todolistItem.
     *
     * @param todolistItem the todolistItem to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new todolistItem, or with status {@code 400 (Bad Request)} if the todolistItem has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/todolist-items")
    public ResponseEntity<TodolistItem> createTodolistItem(@Valid @RequestBody TodolistItem todolistItem) throws URISyntaxException {
        log.debug("REST request to save TodolistItem : {}", todolistItem);
        if (todolistItem.getId() != null) {
            throw new BadRequestAlertException("A new todolistItem cannot already have an ID", ENTITY_NAME, "idexists");
        }
        TodolistItem result = todolistItemRepository.save(todolistItem);
        return ResponseEntity
            .created(new URI("/api/todolist-items/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /todolist-items/:id} : Updates an existing todolistItem.
     *
     * @param id the id of the todolistItem to save.
     * @param todolistItem the todolistItem to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated todolistItem,
     * or with status {@code 400 (Bad Request)} if the todolistItem is not valid,
     * or with status {@code 500 (Internal Server Error)} if the todolistItem couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/todolist-items/{id}")
    public ResponseEntity<TodolistItem> updateTodolistItem(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody TodolistItem todolistItem
    ) throws URISyntaxException {
        log.debug("REST request to update TodolistItem : {}, {}", id, todolistItem);
        if (todolistItem.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, todolistItem.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!todolistItemRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        TodolistItem result = todolistItemRepository.save(todolistItem);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, todolistItem.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /todolist-items/:id} : Partial updates given fields of an existing todolistItem, field will ignore if it is null
     *
     * @param id the id of the todolistItem to save.
     * @param todolistItem the todolistItem to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated todolistItem,
     * or with status {@code 400 (Bad Request)} if the todolistItem is not valid,
     * or with status {@code 404 (Not Found)} if the todolistItem is not found,
     * or with status {@code 500 (Internal Server Error)} if the todolistItem couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/todolist-items/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<TodolistItem> partialUpdateTodolistItem(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody TodolistItem todolistItem
    ) throws URISyntaxException {
        log.debug("REST request to partial update TodolistItem partially : {}, {}", id, todolistItem);
        if (todolistItem.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, todolistItem.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!todolistItemRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<TodolistItem> result = todolistItemRepository
            .findById(todolistItem.getId())
            .map(existingTodolistItem -> {
                if (todolistItem.getHeading() != null) {
                    existingTodolistItem.setHeading(todolistItem.getHeading());
                }
                if (todolistItem.getDescription() != null) {
                    existingTodolistItem.setDescription(todolistItem.getDescription());
                }
                if (todolistItem.getCreationTime() != null) {
                    existingTodolistItem.setCreationTime(todolistItem.getCreationTime());
                }
                if (todolistItem.getLastEditTime() != null) {
                    existingTodolistItem.setLastEditTime(todolistItem.getLastEditTime());
                }
                if (todolistItem.getCompleted() != null) {
                    existingTodolistItem.setCompleted(todolistItem.getCompleted());
                }

                return existingTodolistItem;
            })
            .map(todolistItemRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, todolistItem.getId().toString())
        );
    }

    /**
     * {@code GET  /todolist-items} : get all the todolistItems.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of todolistItems in body.
     */
    @GetMapping("/todolist-items")
    public List<TodolistItem> getAllTodolistItems() {
        log.debug("REST request to get all TodolistItems");
        return todolistItemRepository.findAll();
    }

    /**
     * {@code GET  /todolist-items/:id} : get the "id" todolistItem.
     *
     * @param id the id of the todolistItem to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the todolistItem, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/todolist-items/{id}")
    public ResponseEntity<TodolistItem> getTodolistItem(@PathVariable Long id) {
        log.debug("REST request to get TodolistItem : {}", id);
        Optional<TodolistItem> todolistItem = todolistItemRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(todolistItem);
    }

    /**
     * {@code DELETE  /todolist-items/:id} : delete the "id" todolistItem.
     *
     * @param id the id of the todolistItem to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/todolist-items/{id}")
    public ResponseEntity<Void> deleteTodolistItem(@PathVariable Long id) {
        log.debug("REST request to delete TodolistItem : {}", id);
        todolistItemRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    public String showTodoList(Model model) {
        List<TodolistItem> todolistItems = todolistItemRepository.findAll();
        model.addAttribute("todolistItems", todolistItems);
        return "todo-list";
    }
}
