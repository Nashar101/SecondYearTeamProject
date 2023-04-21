package uk.ac.bham.teamproject.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import uk.ac.bham.teamproject.domain.AntiprocrastinationListTwo;

/**
 * Spring Data JPA repository for the AntiprocrastinationListTwo entity.
 */
@Repository
public interface AntiprocrastinationListTwoRepository extends JpaRepository<AntiprocrastinationListTwo, Long> {
    @Query(
        "select antiprocrastinationListTwo from AntiprocrastinationListTwo antiprocrastinationListTwo where antiprocrastinationListTwo.user.login = ?#{principal.username}"
    )
    List<AntiprocrastinationListTwo> findByUserIsCurrentUser();

    default Optional<AntiprocrastinationListTwo> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<AntiprocrastinationListTwo> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<AntiprocrastinationListTwo> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct antiprocrastinationListTwo from AntiprocrastinationListTwo antiprocrastinationListTwo left join fetch antiprocrastinationListTwo.user",
        countQuery = "select count(distinct antiprocrastinationListTwo) from AntiprocrastinationListTwo antiprocrastinationListTwo"
    )
    Page<AntiprocrastinationListTwo> findAllWithToOneRelationships(Pageable pageable);

    @Query(
        "select distinct antiprocrastinationListTwo from AntiprocrastinationListTwo antiprocrastinationListTwo left join fetch antiprocrastinationListTwo.user"
    )
    List<AntiprocrastinationListTwo> findAllWithToOneRelationships();

    @Query(
        "select antiprocrastinationListTwo from AntiprocrastinationListTwo antiprocrastinationListTwo left join fetch antiprocrastinationListTwo.user where antiprocrastinationListTwo.id =:id"
    )
    Optional<AntiprocrastinationListTwo> findOneWithToOneRelationships(@Param("id") Long id);
}
