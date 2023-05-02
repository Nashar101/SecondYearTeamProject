package uk.ac.bham.teamproject.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import uk.ac.bham.teamproject.web.rest.TestUtil;

class HistoryTwoTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(HistoryTwo.class);
        HistoryTwo historyTwo1 = new HistoryTwo();
        historyTwo1.setId(1L);
        HistoryTwo historyTwo2 = new HistoryTwo();
        historyTwo2.setId(historyTwo1.getId());
        assertThat(historyTwo1).isEqualTo(historyTwo2);
        historyTwo2.setId(2L);
        assertThat(historyTwo1).isNotEqualTo(historyTwo2);
        historyTwo1.setId(null);
        assertThat(historyTwo1).isNotEqualTo(historyTwo2);
    }
}
