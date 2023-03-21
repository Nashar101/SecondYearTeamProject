package uk.ac.bham.teamproject.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import uk.ac.bham.teamproject.web.rest.TestUtil;

class AntiProcrastinationListTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(AntiProcrastinationList.class);
        AntiProcrastinationList antiProcrastinationList1 = new AntiProcrastinationList();
        antiProcrastinationList1.setId(1L);
        AntiProcrastinationList antiProcrastinationList2 = new AntiProcrastinationList();
        antiProcrastinationList2.setId(antiProcrastinationList1.getId());
        assertThat(antiProcrastinationList1).isEqualTo(antiProcrastinationList2);
        antiProcrastinationList2.setId(2L);
        assertThat(antiProcrastinationList1).isNotEqualTo(antiProcrastinationList2);
        antiProcrastinationList1.setId(null);
        assertThat(antiProcrastinationList1).isNotEqualTo(antiProcrastinationList2);
    }
}
