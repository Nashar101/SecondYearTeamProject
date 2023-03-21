package uk.ac.bham.teamproject.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import uk.ac.bham.teamproject.domain.DiaryPage;

/**
 * Spring Data JPA repository for the DiaryPage entity.
 */
@Repository
public interface DiaryPageRepository extends JpaRepository<DiaryPage, Long> {
    @Query("select diaryPage from DiaryPage diaryPage where diaryPage.user.login = ?#{principal.username}")
    List<DiaryPage> findByUserIsCurrentUser();

    default Optional<DiaryPage> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<DiaryPage> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<DiaryPage> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct diaryPage from DiaryPage diaryPage left join fetch diaryPage.user",
        countQuery = "select count(distinct diaryPage) from DiaryPage diaryPage"
    )
    Page<DiaryPage> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct diaryPage from DiaryPage diaryPage left join fetch diaryPage.user")
    List<DiaryPage> findAllWithToOneRelationships();

    @Query("select diaryPage from DiaryPage diaryPage left join fetch diaryPage.user where diaryPage.id =:id")
    Optional<DiaryPage> findOneWithToOneRelationships(@Param("id") Long id);
}
