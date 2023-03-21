package uk.ac.bham.teamproject.domain;

import java.io.Serializable;
import java.time.Instant;
import java.time.ZonedDateTime;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A DiaryPage.
 */
@Entity
@Table(name = "diary_page")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class DiaryPage implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "page_date", nullable = false)
    private ZonedDateTime pageDate;

    @Column(name = "page_description")
    private String pageDescription;

    @NotNull
    @Column(name = "creation_time", nullable = false)
    private Instant creationTime;

    @NotNull
    @Column(name = "last_edit_time", nullable = false)
    private Instant lastEditTime;

    @ManyToOne
    private User user;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public DiaryPage id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ZonedDateTime getPageDate() {
        return this.pageDate;
    }

    public DiaryPage pageDate(ZonedDateTime pageDate) {
        this.setPageDate(pageDate);
        return this;
    }

    public void setPageDate(ZonedDateTime pageDate) {
        this.pageDate = pageDate;
    }

    public String getPageDescription() {
        return this.pageDescription;
    }

    public DiaryPage pageDescription(String pageDescription) {
        this.setPageDescription(pageDescription);
        return this;
    }

    public void setPageDescription(String pageDescription) {
        this.pageDescription = pageDescription;
    }

    public Instant getCreationTime() {
        return this.creationTime;
    }

    public DiaryPage creationTime(Instant creationTime) {
        this.setCreationTime(creationTime);
        return this;
    }

    public void setCreationTime(Instant creationTime) {
        this.creationTime = creationTime;
    }

    public Instant getLastEditTime() {
        return this.lastEditTime;
    }

    public DiaryPage lastEditTime(Instant lastEditTime) {
        this.setLastEditTime(lastEditTime);
        return this;
    }

    public void setLastEditTime(Instant lastEditTime) {
        this.lastEditTime = lastEditTime;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public DiaryPage user(User user) {
        this.setUser(user);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof DiaryPage)) {
            return false;
        }
        return id != null && id.equals(((DiaryPage) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "DiaryPage{" +
            "id=" + getId() +
            ", pageDate='" + getPageDate() + "'" +
            ", pageDescription='" + getPageDescription() + "'" +
            ", creationTime='" + getCreationTime() + "'" +
            ", lastEditTime='" + getLastEditTime() + "'" +
            "}";
    }
}
