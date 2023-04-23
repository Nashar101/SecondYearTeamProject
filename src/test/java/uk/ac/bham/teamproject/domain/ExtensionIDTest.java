package uk.ac.bham.teamproject.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import uk.ac.bham.teamproject.web.rest.TestUtil;

class ExtensionIDTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ExtensionID.class);
        ExtensionID extensionID1 = new ExtensionID();
        extensionID1.setId(1L);
        ExtensionID extensionID2 = new ExtensionID();
        extensionID2.setId(extensionID1.getId());
        assertThat(extensionID1).isEqualTo(extensionID2);
        extensionID2.setId(2L);
        assertThat(extensionID1).isNotEqualTo(extensionID2);
        extensionID1.setId(null);
        assertThat(extensionID1).isNotEqualTo(extensionID2);
    }
}
