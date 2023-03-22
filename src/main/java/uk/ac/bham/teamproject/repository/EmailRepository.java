package uk.ac.bham.teamproject.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import uk.ac.bham.teamproject.domain.Email;

/**
 * Spring Data JPA repository for the Email entity.
 */
@Repository
public interface EmailRepository extends JpaRepository<Email, Long> {
    @Query("select email from Email email where email.user.login = ?#{principal.username}")
    List<Email> findByUserIsCurrentUser();

    default Optional<Email> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<Email> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<Email> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct email from Email email left join fetch email.user",
        countQuery = "select count(distinct email) from Email email"
    )
    Page<Email> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct email from Email email left join fetch email.user")
    List<Email> findAllWithToOneRelationships();

    @Query("select email from Email email left join fetch email.user where email.id =:id")
    Optional<Email> findOneWithToOneRelationships(@Param("id") Long id);
}
