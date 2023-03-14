package uk.ac.bham.teamproject.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import uk.ac.bham.teamproject.web.rest.TestUtil;

class TestingTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Testing.class);
        Testing testing1 = new Testing();
        testing1.setId(1L);
        Testing testing2 = new Testing();
        testing2.setId(testing1.getId());
        assertThat(testing1).isEqualTo(testing2);
        testing2.setId(2L);
        assertThat(testing1).isNotEqualTo(testing2);
        testing1.setId(null);
        assertThat(testing1).isNotEqualTo(testing2);
    }
}
