package uk.ac.bham.teamproject.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import uk.ac.bham.teamproject.web.rest.TestUtil;

class AntiprocrastinationListTwoTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(AntiprocrastinationListTwo.class);
        AntiprocrastinationListTwo antiprocrastinationListTwo1 = new AntiprocrastinationListTwo();
        antiprocrastinationListTwo1.setId(1L);
        AntiprocrastinationListTwo antiprocrastinationListTwo2 = new AntiprocrastinationListTwo();
        antiprocrastinationListTwo2.setId(antiprocrastinationListTwo1.getId());
        assertThat(antiprocrastinationListTwo1).isEqualTo(antiprocrastinationListTwo2);
        antiprocrastinationListTwo2.setId(2L);
        assertThat(antiprocrastinationListTwo1).isNotEqualTo(antiprocrastinationListTwo2);
        antiprocrastinationListTwo1.setId(null);
        assertThat(antiprocrastinationListTwo1).isNotEqualTo(antiprocrastinationListTwo2);
    }
}
