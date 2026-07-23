package mx.com.logikamobile.lmbc.domain.entities

import java.time.LocalDateTime

data class Company(
    val id: Int,
    val name: String,
    val type: String,
    val supportHoursQuota: Int,
    val supportHoursUsed: Int,
    val primaryColor: String?,
    val secondaryColor: String?,
    val accentColor: String?,
    val logoPath: String?,
    val isActive: Boolean,
    val updatedAt: LocalDateTime,
    val deletedAt: LocalDateTime?
)

data class User(
    val id: Int,
    val name: String,
    val email: String,
    val passwordHash: String,
    val companyId: Int,
    val isActive: Boolean,
    val requiresPasswordChange: Boolean,
    val updatedAt: LocalDateTime,
    val deletedAt: LocalDateTime?
)

data class Project(
    val id: Int,
    val companyId: Int,
    val name: String,
    val type: String,
    val status: String,
    val cooldownUntil: LocalDateTime?,
    val updatedAt: LocalDateTime,
    val deletedAt: LocalDateTime?
)

data class Ticket(
    val id: Int,
    val projectId: Int,
    val createdBy: Int,
    val type: String,
    val status: String,
    val priority: String,
    val description: String,
    val serviceHours: Int?,
    val startedAt: LocalDateTime?,
    val closedAt: LocalDateTime?,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime,
    val deletedAt: LocalDateTime?
)

data class TicketMessage(
    val id: Int,
    val ticketId: Int,
    val senderId: Int,
    val senderName: String? = null,
    val message: String,
    val timestamp: LocalDateTime,
    val updatedAt: LocalDateTime,
    val deletedAt: LocalDateTime?
)
