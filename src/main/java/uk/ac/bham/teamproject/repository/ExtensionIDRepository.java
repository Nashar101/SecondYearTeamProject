package uk.ac.bham.teamproject.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import uk.ac.bham.teamproject.domain.ExtensionID;

/**
 * Spring Data JPA repository for the ExtensionID entity.
 */
@Repository
public interface ExtensionIDRepository extends JpaRepository<ExtensionID, Long> {
    @Query("select extensionID from ExtensionID extensionID where extensionID.user.login = ?#{principal.username}")
    List<ExtensionID> findByUserIsCurrentUser();

    default Optional<ExtensionID> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<ExtensionID> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<ExtensionID> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct extensionID from ExtensionID extensionID left join fetch extensionID.user",
        countQuery = "select count(distinct extensionID) from ExtensionID extensionID"
    )
    Page<ExtensionID> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct extensionID from ExtensionID extensionID left join fetch extensionID.user")
    List<ExtensionID> findAllWithToOneRelationships();

    @Query("select extensionID from ExtensionID extensionID left join fetch extensionID.user where extensionID.id =:id")
    Optional<ExtensionID> findOneWithToOneRelationships(@Param("id") Long id);
}
