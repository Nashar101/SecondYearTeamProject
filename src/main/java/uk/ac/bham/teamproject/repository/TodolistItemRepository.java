package uk.ac.bham.teamproject.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import uk.ac.bham.teamproject.domain.TodolistItem;

/**
 * Spring Data JPA repository for the TodolistItem entity.
 */
@Repository
public interface TodolistItemRepository extends JpaRepository<TodolistItem, Long> {
    @Query("select todolistItem from TodolistItem todolistItem where todolistItem.user.login = ?#{principal.username}")
    List<TodolistItem> findByUserIsCurrentUser();

    default Optional<TodolistItem> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<TodolistItem> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<TodolistItem> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct todolistItem from TodolistItem todolistItem left join fetch todolistItem.user",
        countQuery = "select count(distinct todolistItem) from TodolistItem todolistItem"
    )
    Page<TodolistItem> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct todolistItem from TodolistItem todolistItem left join fetch todolistItem.user")
    List<TodolistItem> findAllWithToOneRelationships();

    @Query("select todolistItem from TodolistItem todolistItem left join fetch todolistItem.user where todolistItem.id =:id")
    Optional<TodolistItem> findOneWithToOneRelationships(@Param("id") Long id);
}
