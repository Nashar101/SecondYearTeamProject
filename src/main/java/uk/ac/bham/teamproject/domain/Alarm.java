package uk.ac.bham.teamproject.domain;

import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Alarm.
 */
@Entity
@Table(name = "alarm")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Alarm implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "alarm_name")
    private String alarmName;

    @Column(name = "type")
    private String type;

    @Column(name = "hours")
    private Integer hours;

    @Column(name = "minutes")
    private Integer minutes;

    @Column(name = "seconds")
    private Integer seconds;

    @ManyToOne
    private User user;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Alarm id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAlarmName() {
        return this.alarmName;
    }

    public Alarm alarmName(String alarmName) {
        this.setAlarmName(alarmName);
        return this;
    }

    public void setAlarmName(String alarmName) {
        this.alarmName = alarmName;
    }

    public String getType() {
        return this.type;
    }

    public Alarm type(String type) {
        this.setType(type);
        return this;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Integer getHours() {
        return this.hours;
    }

    public Alarm hours(Integer hours) {
        this.setHours(hours);
        return this;
    }

    public void setHours(Integer hours) {
        this.hours = hours;
    }

    public Integer getMinutes() {
        return this.minutes;
    }

    public Alarm minutes(Integer minutes) {
        this.setMinutes(minutes);
        return this;
    }

    public void setMinutes(Integer minutes) {
        this.minutes = minutes;
    }

    public Integer getSeconds() {
        return this.seconds;
    }

    public Alarm seconds(Integer seconds) {
        this.setSeconds(seconds);
        return this;
    }

    public void setSeconds(Integer seconds) {
        this.seconds = seconds;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Alarm user(User user) {
        this.setUser(user);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Alarm)) {
            return false;
        }
        return id != null && id.equals(((Alarm) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Alarm{" +
            "id=" + getId() +
            ", alarmName='" + getAlarmName() + "'" +
            ", type='" + getType() + "'" +
            ", hours=" + getHours() +
            ", minutes=" + getMinutes() +
            ", seconds=" + getSeconds() +
            "}";
    }
}
