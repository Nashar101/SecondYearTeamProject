package uk.ac.bham.teamproject.domain;

import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A HistoryTwo.
 */
@Entity
@Table(name = "history_two")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class HistoryTwo implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "subject")
    private String subject;

    @Column(name = "subject_score")
    private Integer subjectScore;

    @Column(name = "subject_target")
    private Integer subjectTarget;

    @Column(name = "upcoming_test")
    private String upcomingTest;

    @Column(name = "upcoming_test_target")
    private Integer upcomingTestTarget;

    @ManyToOne
    private User user;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public HistoryTwo id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSubject() {
        return this.subject;
    }

    public HistoryTwo subject(String subject) {
        this.setSubject(subject);
        return this;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public Integer getSubjectScore() {
        return this.subjectScore;
    }

    public HistoryTwo subjectScore(Integer subjectScore) {
        this.setSubjectScore(subjectScore);
        return this;
    }

    public void setSubjectScore(Integer subjectScore) {
        this.subjectScore = subjectScore;
    }

    public Integer getSubjectTarget() {
        return this.subjectTarget;
    }

    public HistoryTwo subjectTarget(Integer subjectTarget) {
        this.setSubjectTarget(subjectTarget);
        return this;
    }

    public void setSubjectTarget(Integer subjectTarget) {
        this.subjectTarget = subjectTarget;
    }

    public String getUpcomingTest() {
        return this.upcomingTest;
    }

    public HistoryTwo upcomingTest(String upcomingTest) {
        this.setUpcomingTest(upcomingTest);
        return this;
    }

    public void setUpcomingTest(String upcomingTest) {
        this.upcomingTest = upcomingTest;
    }

    public Integer getUpcomingTestTarget() {
        return this.upcomingTestTarget;
    }

    public HistoryTwo upcomingTestTarget(Integer upcomingTestTarget) {
        this.setUpcomingTestTarget(upcomingTestTarget);
        return this;
    }

    public void setUpcomingTestTarget(Integer upcomingTestTarget) {
        this.upcomingTestTarget = upcomingTestTarget;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public HistoryTwo user(User user) {
        this.setUser(user);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof HistoryTwo)) {
            return false;
        }
        return id != null && id.equals(((HistoryTwo) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "HistoryTwo{" +
            "id=" + getId() +
            ", subject='" + getSubject() + "'" +
            ", subjectScore=" + getSubjectScore() +
            ", subjectTarget=" + getSubjectTarget() +
            ", upcomingTest='" + getUpcomingTest() + "'" +
            ", upcomingTestTarget=" + getUpcomingTestTarget() +
            "}";
    }
}
