package uk.ac.bham.teamproject.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import uk.ac.bham.teamproject.domain.HistoryTwo;

/**
 * Spring Data JPA repository for the HistoryTwo entity.
 */
@Repository
public interface HistoryTwoRepository extends JpaRepository<HistoryTwo, Long> {
    @Query("select historyTwo from HistoryTwo historyTwo where historyTwo.user.login = ?#{principal.username}")
    List<HistoryTwo> findByUserIsCurrentUser();

    default Optional<HistoryTwo> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<HistoryTwo> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<HistoryTwo> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct historyTwo from HistoryTwo historyTwo left join fetch historyTwo.user",
        countQuery = "select count(distinct historyTwo) from HistoryTwo historyTwo"
    )
    Page<HistoryTwo> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct historyTwo from HistoryTwo historyTwo left join fetch historyTwo.user")
    List<HistoryTwo> findAllWithToOneRelationships();

    @Query("select historyTwo from HistoryTwo historyTwo left join fetch historyTwo.user where historyTwo.id =:id")
    Optional<HistoryTwo> findOneWithToOneRelationships(@Param("id") Long id);
}
