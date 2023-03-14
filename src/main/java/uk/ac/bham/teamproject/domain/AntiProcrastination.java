package uk.ac.bham.teamproject.domain;

import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A AntiProcrastination.
 */
@Entity
@Table(name = "anti_procrastination")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class AntiProcrastination implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "url", nullable = false)
    private String url;

    @NotNull
    @Column(name = "type", nullable = false)
    private Boolean type;

    @NotNull
    @Column(name = "days", nullable = false)
    private Integer days;

    @NotNull
    @Column(name = "hours", nullable = false)
    private Integer hours;

    @NotNull
    @Column(name = "minutes", nullable = false)
    private Integer minutes;

    @NotNull
    @Column(name = "seconds", nullable = false)
    private Integer seconds;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public AntiProcrastination id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUrl() {
        return this.url;
    }

    public AntiProcrastination url(String url) {
        this.setUrl(url);
        return this;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public Boolean getType() {
        return this.type;
    }

    public AntiProcrastination type(Boolean type) {
        this.setType(type);
        return this;
    }

    public void setType(Boolean type) {
        this.type = type;
    }

    public Integer getDays() {
        return this.days;
    }

    public AntiProcrastination days(Integer days) {
        this.setDays(days);
        return this;
    }

    public void setDays(Integer days) {
        this.days = days;
    }

    public Integer getHours() {
        return this.hours;
    }

    public AntiProcrastination hours(Integer hours) {
        this.setHours(hours);
        return this;
    }

    public void setHours(Integer hours) {
        this.hours = hours;
    }

    public Integer getMinutes() {
        return this.minutes;
    }

    public AntiProcrastination minutes(Integer minutes) {
        this.setMinutes(minutes);
        return this;
    }

    public void setMinutes(Integer minutes) {
        this.minutes = minutes;
    }

    public Integer getSeconds() {
        return this.seconds;
    }

    public AntiProcrastination seconds(Integer seconds) {
        this.setSeconds(seconds);
        return this;
    }

    public void setSeconds(Integer seconds) {
        this.seconds = seconds;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof AntiProcrastination)) {
            return false;
        }
        return id != null && id.equals(((AntiProcrastination) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "AntiProcrastination{" +
            "id=" + getId() +
            ", url='" + getUrl() + "'" +
            ", type='" + getType() + "'" +
            ", days=" + getDays() +
            ", hours=" + getHours() +
            ", minutes=" + getMinutes() +
            ", seconds=" + getSeconds() +
            "}";
    }
}
