package uk.ac.bham.teamproject.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.Instant;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A ToDoItem.
 */
@Entity
@Table(name = "to_do_item")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ToDoItem implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "to_do_item_heading", nullable = false)
    private String toDoItemHeading;

    @Column(name = "to_do_item_description")
    private String toDoItemDescription;

    @NotNull
    @Column(name = "to_do_item_status", nullable = false)
    private Instant toDoItemStatus;

    @ManyToOne
    @JsonIgnoreProperties(value = { "user" }, allowSetters = true)
    private DiaryPage diaryPage;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public ToDoItem id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getToDoItemHeading() {
        return this.toDoItemHeading;
    }

    public ToDoItem toDoItemHeading(String toDoItemHeading) {
        this.setToDoItemHeading(toDoItemHeading);
        return this;
    }

    public void setToDoItemHeading(String toDoItemHeading) {
        this.toDoItemHeading = toDoItemHeading;
    }

    public String getToDoItemDescription() {
        return this.toDoItemDescription;
    }

    public ToDoItem toDoItemDescription(String toDoItemDescription) {
        this.setToDoItemDescription(toDoItemDescription);
        return this;
    }

    public void setToDoItemDescription(String toDoItemDescription) {
        this.toDoItemDescription = toDoItemDescription;
    }

    public Instant getToDoItemStatus() {
        return this.toDoItemStatus;
    }

    public ToDoItem toDoItemStatus(Instant toDoItemStatus) {
        this.setToDoItemStatus(toDoItemStatus);
        return this;
    }

    public void setToDoItemStatus(Instant toDoItemStatus) {
        this.toDoItemStatus = toDoItemStatus;
    }

    public DiaryPage getDiaryPage() {
        return this.diaryPage;
    }

    public void setDiaryPage(DiaryPage diaryPage) {
        this.diaryPage = diaryPage;
    }

    public ToDoItem diaryPage(DiaryPage diaryPage) {
        this.setDiaryPage(diaryPage);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ToDoItem)) {
            return false;
        }
        return id != null && id.equals(((ToDoItem) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ToDoItem{" +
            "id=" + getId() +
            ", toDoItemHeading='" + getToDoItemHeading() + "'" +
            ", toDoItemDescription='" + getToDoItemDescription() + "'" +
            ", toDoItemStatus='" + getToDoItemStatus() + "'" +
            "}";
    }
}
