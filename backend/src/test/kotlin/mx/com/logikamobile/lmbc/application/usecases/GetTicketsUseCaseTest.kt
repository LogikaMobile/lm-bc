package mx.com.logikamobile.lmbc.application.usecases

import io.mockk.coEvery
import io.mockk.mockk
import kotlinx.coroutines.test.runTest
import mx.com.logikamobile.lmbc.application.interfaces.TicketRepository
import mx.com.logikamobile.lmbc.domain.entities.Ticket
import java.time.LocalDateTime
import kotlin.test.Test
import kotlin.test.assertEquals

class GetTicketsUseCaseTest {

    private val ticketRepository = mockk<TicketRepository>()
    private val getTicketsUseCase = GetTicketsUseCase(ticketRepository)

    @Test
    fun `execute returns all tickets when company is INTERNAL`() = runTest {
        // Arrange
        val companyId = 1
        val companyType = "INTERNAL"
        val limit = 10
        val offset = 0
        
        val fakeTickets = listOf(
            Ticket(1, 1, 1, "BUG", "OPEN", "HIGH", "Desc 1", LocalDateTime.now(), LocalDateTime.now(), null),
            Ticket(2, 2, 2, "FEATURE", "CLOSED", "LOW", "Desc 2", LocalDateTime.now(), LocalDateTime.now(), null)
        )

        coEvery { ticketRepository.getTickets(limit, offset.toLong(), companyId, companyType) } returns fakeTickets

        // Act
        val result = getTicketsUseCase.execute(companyId, companyType, limit, offset)

        // Assert
        assertEquals(2, result.size)
        assertEquals("Desc 1", result[0].description)
    }

    @Test
    fun `execute returns only company tickets when company is CLIENT`() = runTest {
        // Arrange
        val companyId = 2 // Client company
        val companyType = "CLIENT"
        val limit = 10
        val offset = 0
        
        val fakeTickets = listOf(
            Ticket(2, 2, 2, "FEATURE", "CLOSED", "LOW", "Desc 2", LocalDateTime.now(), LocalDateTime.now(), null)
        )

        coEvery { ticketRepository.getTickets(limit, offset.toLong(), companyId, companyType) } returns fakeTickets

        // Act
        val result = getTicketsUseCase.execute(companyId, companyType, limit, offset)

        // Assert
        assertEquals(1, result.size)
        assertEquals("Desc 2", result[0].description)
    }
}
