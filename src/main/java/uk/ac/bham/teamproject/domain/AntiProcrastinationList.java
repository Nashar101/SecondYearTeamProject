package uk.ac.bham.teamproject.domain;

import java.io.Serializable;
import java.time.ZonedDateTime;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A AntiProcrastinationList.
 */
@Entity
@Table(name = "anti_procrastination_list")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class AntiProcrastinationList implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "link")
    private String link;

    @Column(name = "type")
    private String type;

    @Column(name = "days")
    private Integer days;

    @Column(name = "hours")
    private Integer hours;

    @Column(name = "minutes")
    private Integer minutes;

    @Column(name = "seconds")
    private Integer seconds;

    @Column(name = "empty")
    private String empty;

    @Column(name = "idk")
    private String idk;

    @Column(name = "idk_1")
    private String idk1;

    @Column(name = "due_date")
    private ZonedDateTime dueDate;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public AntiProcrastinationList id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLink() {
        return this.link;
    }

    public AntiProcrastinationList link(String link) {
        this.setLink(link);
        return this;
    }

    public void setLink(String link) {
        this.link = link;
    }

    public String getType() {
        return this.type;
    }

    public AntiProcrastinationList type(String type) {
        this.setType(type);
        return this;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Integer getDays() {
        return this.days;
    }

    public AntiProcrastinationList days(Integer days) {
        this.setDays(days);
        return this;
    }

    public void setDays(Integer days) {
        this.days = days;
    }

    public Integer getHours() {
        return this.hours;
    }

    public AntiProcrastinationList hours(Integer hours) {
        this.setHours(hours);
        return this;
    }

    public void setHours(Integer hours) {
        this.hours = hours;
    }

    public Integer getMinutes() {
        return this.minutes;
    }

    public AntiProcrastinationList minutes(Integer minutes) {
        this.setMinutes(minutes);
        return this;
    }

    public void setMinutes(Integer minutes) {
        this.minutes = minutes;
    }

    public Integer getSeconds() {
        return this.seconds;
    }

    public AntiProcrastinationList seconds(Integer seconds) {
        this.setSeconds(seconds);
        return this;
    }

    public void setSeconds(Integer seconds) {
        this.seconds = seconds;
    }

    public String getEmpty() {
        return this.empty;
    }

    public AntiProcrastinationList empty(String empty) {
        this.setEmpty(empty);
        return this;
    }

    public void setEmpty(String empty) {
        this.empty = empty;
    }

    public String getIdk() {
        return this.idk;
    }

    public AntiProcrastinationList idk(String idk) {
        this.setIdk(idk);
        return this;
    }

    public void setIdk(String idk) {
        this.idk = idk;
    }

    public String getIdk1() {
        return this.idk1;
    }

    public AntiProcrastinationList idk1(String idk1) {
        this.setIdk1(idk1);
        return this;
    }

    public void setIdk1(String idk1) {
        this.idk1 = idk1;
    }

    public ZonedDateTime getDueDate() {
        return this.dueDate;
    }

    public AntiProcrastinationList dueDate(ZonedDateTime dueDate) {
        this.setDueDate(dueDate);
        return this;
    }

    public void setDueDate(ZonedDateTime dueDate) {
        this.dueDate = dueDate;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof AntiProcrastinationList)) {
            return false;
        }
        return id != null && id.equals(((AntiProcrastinationList) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "AntiProcrastinationList{" +
            "id=" + getId() +
            ", link='" + getLink() + "'" +
            ", type='" + getType() + "'" +
            ", days=" + getDays() +
            ", hours=" + getHours() +
            ", minutes=" + getMinutes() +
            ", seconds=" + getSeconds() +
            ", empty='" + getEmpty() + "'" +
            ", idk='" + getIdk() + "'" +
            ", idk1='" + getIdk1() + "'" +
            ", dueDate='" + getDueDate() + "'" +
            "}";
    }
}
