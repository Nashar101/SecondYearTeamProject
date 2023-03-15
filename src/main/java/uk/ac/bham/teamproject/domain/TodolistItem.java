package uk.ac.bham.teamproject.domain;

import java.io.Serializable;
import java.time.Instant;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A TodolistItem.
 */
@Entity
@Table(name = "todolist_item")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class TodolistItem implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Size(min = 3)
    @Column(name = "heading", nullable = false)
    private String heading;

    @NotNull
    @Column(name = "description", nullable = false)
    private String description;

    @NotNull
    @Column(name = "creation_time", nullable = false)
    private Instant creationTime;

    @NotNull
    @Column(name = "last_edit_time", nullable = false)
    private Instant lastEditTime;

    @NotNull
    @Column(name = "completed", nullable = false)
    private Boolean completed;

    @ManyToOne
    private User user;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public TodolistItem id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getHeading() {
        return this.heading;
    }

    public TodolistItem heading(String heading) {
        this.setHeading(heading);
        return this;
    }

    public void setHeading(String heading) {
        this.heading = heading;
    }

    public String getDescription() {
        return this.description;
    }

    public TodolistItem description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Instant getCreationTime() {
        return this.creationTime;
    }

    public TodolistItem creationTime(Instant creationTime) {
        this.setCreationTime(creationTime);
        return this;
    }

    public void setCreationTime(Instant creationTime) {
        this.creationTime = creationTime;
    }

    public Instant getLastEditTime() {
        return this.lastEditTime;
    }

    public TodolistItem lastEditTime(Instant lastEditTime) {
        this.setLastEditTime(lastEditTime);
        return this;
    }

    public void setLastEditTime(Instant lastEditTime) {
        this.lastEditTime = lastEditTime;
    }

    public Boolean getCompleted() {
        return this.completed;
    }

    public TodolistItem completed(Boolean completed) {
        this.setCompleted(completed);
        return this;
    }

    public void setCompleted(Boolean completed) {
        this.completed = completed;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public TodolistItem user(User user) {
        this.setUser(user);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof TodolistItem)) {
            return false;
        }
        return id != null && id.equals(((TodolistItem) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "TodolistItem{" +
            "id=" + getId() +
            ", heading='" + getHeading() + "'" +
            ", description='" + getDescription() + "'" +
            ", creationTime='" + getCreationTime() + "'" +
            ", lastEditTime='" + getLastEditTime() + "'" +
            ", completed='" + getCompleted() + "'" +
            "}";
    }
}
