package uk.ac.bham.teamproject.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import uk.ac.bham.teamproject.web.rest.TestUtil;

class TodolistItemTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(TodolistItem.class);
        TodolistItem todolistItem1 = new TodolistItem();
        todolistItem1.setId(1L);
        TodolistItem todolistItem2 = new TodolistItem();
        todolistItem2.setId(todolistItem1.getId());
        assertThat(todolistItem1).isEqualTo(todolistItem2);
        todolistItem2.setId(2L);
        assertThat(todolistItem1).isNotEqualTo(todolistItem2);
        todolistItem1.setId(null);
        assertThat(todolistItem1).isNotEqualTo(todolistItem2);
    }
}
