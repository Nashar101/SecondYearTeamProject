package uk.ac.bham.teamproject.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import uk.ac.bham.teamproject.web.rest.TestUtil;

class AntiProcrastinationTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(AntiProcrastination.class);
        AntiProcrastination antiProcrastination1 = new AntiProcrastination();
        antiProcrastination1.setId(1L);
        AntiProcrastination antiProcrastination2 = new AntiProcrastination();
        antiProcrastination2.setId(antiProcrastination1.getId());
        assertThat(antiProcrastination1).isEqualTo(antiProcrastination2);
        antiProcrastination2.setId(2L);
        assertThat(antiProcrastination1).isNotEqualTo(antiProcrastination2);
        antiProcrastination1.setId(null);
        assertThat(antiProcrastination1).isNotEqualTo(antiProcrastination2);
    }
}
