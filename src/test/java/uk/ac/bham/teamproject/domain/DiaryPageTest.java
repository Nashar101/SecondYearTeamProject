package uk.ac.bham.teamproject.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import uk.ac.bham.teamproject.web.rest.TestUtil;

class DiaryPageTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(DiaryPage.class);
        DiaryPage diaryPage1 = new DiaryPage();
        diaryPage1.setId(1L);
        DiaryPage diaryPage2 = new DiaryPage();
        diaryPage2.setId(diaryPage1.getId());
        assertThat(diaryPage1).isEqualTo(diaryPage2);
        diaryPage2.setId(2L);
        assertThat(diaryPage1).isNotEqualTo(diaryPage2);
        diaryPage1.setId(null);
        assertThat(diaryPage1).isNotEqualTo(diaryPage2);
    }
}
