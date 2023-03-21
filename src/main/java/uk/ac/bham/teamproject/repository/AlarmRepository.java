package uk.ac.bham.teamproject.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import uk.ac.bham.teamproject.domain.Alarm;

/**
 * Spring Data JPA repository for the Alarm entity.
 */
@Repository
public interface AlarmRepository extends JpaRepository<Alarm, Long> {
    @Query("select alarm from Alarm alarm where alarm.user.login = ?#{principal.username}")
    List<Alarm> findByUserIsCurrentUser();

    default Optional<Alarm> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<Alarm> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<Alarm> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct alarm from Alarm alarm left join fetch alarm.user",
        countQuery = "select count(distinct alarm) from Alarm alarm"
    )
    Page<Alarm> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct alarm from Alarm alarm left join fetch alarm.user")
    List<Alarm> findAllWithToOneRelationships();

    @Query("select alarm from Alarm alarm left join fetch alarm.user where alarm.id =:id")
    Optional<Alarm> findOneWithToOneRelationships(@Param("id") Long id);
}
