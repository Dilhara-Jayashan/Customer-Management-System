package com.dilhara.customer.model;

import lombok.*;

import javax.persistence.*;

@Entity
@Table(name = "family_members", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"customer_id", "family_customer_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FamilyMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "family_customer_id", nullable = false)
    private Customer familyCustomer;

    @Column(length = 50)
    private String relationship;
}
